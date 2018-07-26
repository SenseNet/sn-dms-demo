import { NewView } from '@sensenet/controls-react'
import { Actions, Reducers } from '@sensenet/redux'
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
        schema: Reducers.getSchema(state.sensenet),
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    createContent: Actions.createContent,
}

class AddNewDialog extends React.Component<AddNewDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleCancel = () => {
        this.props.closeDialog()
    }
    public render() {
        const { parentPath, contentTypeName, closeDialog, createContent, schema } = this.props
        return (
            <NewView
                schema={schema}
                path={parentPath}
                repository={repository}
                contentTypeName={contentTypeName}
                handleCancel={() => this.handleCancel()}
                onSubmit={createContent}
                submitCallback={closeDialog} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewDialog)
