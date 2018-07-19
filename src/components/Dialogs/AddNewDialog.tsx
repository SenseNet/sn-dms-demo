import { NewView } from '@sensenet/controls-react'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import { repository } from '../../index'

interface AddNewDialogProps {
    parentPath: string,
    contentTypeName: string,
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
}

class AddNewDialog extends React.Component<AddNewDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleClose = () => {
        this.props.closeDialog()
    }
    public render() {
        const { parentPath, contentTypeName } = this.props
        return (
            <NewView path={parentPath} repository={repository} contentTypeName={contentTypeName} handleCancel={() => this.handleClose()} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewDialog)
