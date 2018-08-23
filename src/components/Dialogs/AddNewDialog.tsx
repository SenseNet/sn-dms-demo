import CircularProgress from '@material-ui/core/CircularProgress'
import { NewView } from '@sensenet/controls-react'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { repository } from '../../index'

interface AddNewDialogProps {
    parentPath: string,
    contentTypeName: string,
    extension?: string,
    title?: string,
}

interface AddNewDialogState {
    ctype: string
}

const mapStateToProps = (state: rootStateType) => {
    return {
        schema: Reducers.getSchema(state.sensenet),
        closeCallback: state.dms.dialog.onClose,
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    createContent: Actions.createContent,
    getSchema: Actions.getSchema,
}

class AddNewDialog extends React.Component<AddNewDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, AddNewDialogState> {
    public state = {
        ctype: '',
    }
    public static getDerivedStateFromProps(newProps: AddNewDialog['props'], lastState: AddNewDialog['state']) {
        if (lastState.ctype !== newProps.contentTypeName && newProps.contentTypeName) {
            newProps.getSchema(newProps.contentTypeName)
        }
        return {
            ctype: newProps.contentTypeName,
        }
    }
    public handleCancel = () => {
        this.props.closeDialog()
    }
    public submitCallback = () => {
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public render() {
        const { parentPath, contentTypeName, createContent, schema, title, extension } = this.props
        return (
            <div style={{ width: 500 }}>
                {schema ?
                    <NewView
                        schema={schema}
                        path={parentPath}
                        repository={repository}
                        contentTypeName={contentTypeName}
                        handleCancel={() => this.handleCancel()}
                        onSubmit={createContent}
                        title={title ? title : null}
                        extension={extension ? extension : null}
                        submitCallback={this.submitCallback} /> :
                    <CircularProgress size={50} />}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewDialog)
