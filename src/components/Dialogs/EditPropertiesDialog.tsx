import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { EditView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'
import { repository } from '../../index'
import DialogInfo from './DialogInfo'

interface EditPropertiesDialogProps {
    content: GenericContent,
    contentTypeName: string,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        schema: Reducers.getSchema(state.sensenet),
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    openDialog: DMSActions.openDialog,
    editContent: Actions.updateContent,
}

class EditPropertiesDialog extends React.Component<EditPropertiesDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleCancel = () => {
        this.props.closeDialog()
    }
    public submitCallback = () => {
        this.props.closeDialog()

    }
    public render() {
        const { content, contentTypeName, editContent } = this.props
        return (
            <div style={{ width: 550 }}>
                <Typography variant="headline" gutterBottom>
                    {resources.EDIT_PROPERTIES}
                </Typography>
                <DialogInfo currentContent={content} />
                {content ?
                    <EditView
                        content={content}
                        repository={repository}
                        contentTypeName={contentTypeName}
                        onSubmit={editContent}
                        handleCancel={() => this.handleCancel()}
                        submitCallback={this.submitCallback} />
                    : <CircularProgress size={50} />}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertiesDialog)
