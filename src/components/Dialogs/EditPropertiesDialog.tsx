import CircularProgress from '@material-ui/core/CircularProgress'
import { EditView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { repository } from '../../index'

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
}

class EditPropertiesDialog extends React.Component<EditPropertiesDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleCancel = () => {
        this.props.closeDialog()
    }
    public submitCallback = () => {
        this.props.closeDialog()
    }
    public render() {
        const { content, contentTypeName } = this.props
        return (
            <div style={{ width: 500 }}>
                {content ?
                    <EditView
                        content={content}
                        repository={repository}
                        contentTypeName={contentTypeName} />
                    : <CircularProgress size={50} />}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertiesDialog)
