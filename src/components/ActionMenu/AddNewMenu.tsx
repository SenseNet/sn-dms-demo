import { IContent } from '@sensenet/client-core'
import { IActionModel } from '@sensenet/default-content-types'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { getContentTypeFromUrl } from '../../assets/helpers'
import * as DMSReducers from '../../Reducers'
import AddNewDialog from '../Dialogs/AddNewDialog'
import { AddNewButton } from '../Menu/AddNewButton'

const mapStateToProps = (state: rootStateType) => {
    return {
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
        actions: DMSReducers.getAddNewTypeList(state.dms.actionmenu),
        schema: Reducers.getSchema(state.sensenet),
        repository: state.sensenet.session.repository,
    }
}

const mapDispatchToProps = {
    getActions: DMSActions.loadTypesToAddNewList,
    closeActionMenu: DMSActions.closeActionMenu,
    openActionMenu: DMSActions.openActionMenu,
    openDialog: DMSActions.openDialog,
    closeDialog: DMSActions.closeDialog,
}

interface AddNemMenuProps {
    currentContent: IContent,
    currentId,
    actions: IActionModel[],
    schema,
    repository,
}

interface DashboardState {
    options: IActionModel[],
    currentContent: IContent,
}

class AddNewMenu extends React.Component<AddNemMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DashboardState> {
    public state = {
        options: [],
        currentContent: null,
    }
    constructor(props: AddNewMenu['props']) {
        super(props)

        this.handleButtonClick = this.handleButtonClick.bind(this)
    }
    public static getDerivedStateFromProps(newProps: AddNewMenu['props'], lastState: AddNewMenu['state']) {
        if ((newProps.currentContent.Id && (lastState.currentContent !== newProps.currentContent)) && lastState.options.length === 0) {
            newProps.getActions(newProps.currentContent.Id)
        }
        const optionList = []
        const folderList = []
        if (lastState.options.length !== newProps.actions.length) {
            newProps.actions.map((action) => {
                const newDisplayName = `New ${action.DisplayName}`
                action.DisplayName = newDisplayName
                const contentType = getContentTypeFromUrl(action.Url)
                action.Action = () => {
                    newProps.closeActionMenu()
                    newProps.openDialog(
                        <AddNewDialog
                            parentPath={newProps.currentContent.Path}
                            contentTypeName={contentType} />,
                        newDisplayName, newProps.closeDialog)
                }
                if (action.DisplayName.indexOf('Folder') > -1) {
                    folderList.push(action)
                } else {
                    optionList.push(action)
                }
            })
        }
        return {
            ...lastState,
            currentContent: newProps.currentContent,
            options: [...optionList, ...folderList],
        }
    }
    public handleButtonClick = (e) => {
        const { currentId } = this.props
        const { options } = this.state
        this.props.closeActionMenu()
        this.props.openActionMenu(options, currentId, currentId, e.currentTarget, {
            top: e.currentTarget.offsetTop + 85,
            left: e.currentTarget.offsetLeft,
        })
    }
    public render() {
        return (
            <AddNewButton
                contentType=""
                onClick={(e) => this.handleButtonClick(e)} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewMenu as any)
