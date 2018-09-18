import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { IODataParams } from '@sensenet/client-core'
import { reactControlMapper } from '@sensenet/controls-react'
import { EditView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { repository } from '../../index'
import { loadEditedContent } from '../../store/edited/actions'
import DialogInfo from './DialogInfo'

interface EditPropertiesDialogProps {
    contentTypeName: string,
    content: GenericContent,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        schemas: state.sensenet.session.repository.schemas,
        editedcontent: state.dms.edited,
        items: state.dms.documentLibrary.items,
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    openDialog: DMSActions.openDialog,
    editContent: Actions.updateContent,
    loadEditedContent,
    getSchema: Actions.getSchema,
}

interface EditPropertiesDialogState {
    editedcontent: GenericContent,
}

class EditPropertiesDialog extends React.Component<EditPropertiesDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, EditPropertiesDialogState> {
    public state = {
        editedcontent: this.props.editedcontent,
    }
    public static getDerivedStateFromProps(newProps: EditPropertiesDialog['props'], lastState: EditPropertiesDialog['state']) {
        if (lastState.editedcontent === null || lastState.editedcontent.Id !== newProps.content.Id) {
            const controlMapper = reactControlMapper(repository)
            const schema = controlMapper.getFullSchemaForContentType(newProps.contentTypeName, 'edit')
            const editableFields = schema.fieldMappings.map((fieldMapping) => fieldMapping.clientSettings.name)
            editableFields.push('Icon')
            const options = {
                select: editableFields,
                metadata: 'no',
            } as IODataParams<GenericContent>
            newProps.loadEditedContent(newProps.content.Id, options)
        }
        return {
            editedcontent: newProps.editedcontent,
        }
    }
    public handleCancel = () => {
        this.props.closeDialog()
    }
    public submitCallback = () => {
        this.props.closeDialog()
    }
    public render() {
        const { contentTypeName, editContent, content } = this.props
        const { editedcontent } = this.state
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) =>
                    <div style={matches ? { width: 550 } : null}>
                        <Typography variant="headline" gutterBottom>
                            {resources.EDIT_PROPERTIES}
                        </Typography>
                        <DialogInfo currentContent={editedcontent ? editedcontent : content} />
                        {editedcontent ?
                            <EditView
                                content={editedcontent}
                                repository={repository}
                                contentTypeName={contentTypeName}
                                onSubmit={editContent}
                                handleCancel={() => this.handleCancel()}
                                submitCallback={this.submitCallback} />
                            : <CircularProgress size={50} />}
                    </div>
                }
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertiesDialog)
