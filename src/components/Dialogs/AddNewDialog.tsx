import { NewView } from '@sensenet/controls-react'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import { repository } from '../../index'

interface AddNewDialogProps {
    parentPath: string,
    contentTypeName: string,
    closeDialog: () => void,
}

class AddNewDialog extends React.Component<AddNewDialogProps, { schema }> {
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

const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps, {
    closeDialog: DMSActions.closeDialog,
})(AddNewDialog as any)
