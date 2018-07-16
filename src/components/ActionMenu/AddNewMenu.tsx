import { IContent } from '@sensenet/client-core'
import { NewView } from '@sensenet/controls-react'
import { IActionModel } from '@sensenet/default-content-types'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import * as DMSReducers from '../../Reducers'
import { AddNewDialog } from '../Dialogs/AddNewDialog'
import { AddNewButton } from '../Menu/AddNewButton'

interface AddNemMenuProps {
    currentContent: IContent,
    currentId,
    getActions,
    actions: IActionModel[],
    closeActionMenu: () => void,
    openActionMenu,
    openDialog,
    schema,
    repository,
}

class AddNewMenu extends React.Component<AddNemMenuProps, { options }> {
    constructor(props) {
        super(props)
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.state = {
            options: [],
        }
    }
    public getContentType = (urlString) => {
        const urlTemp = urlString.split('ContentTypeName=')[1]
        return urlTemp.indexOf('&') > -1 ? urlTemp.split('&')[0] : urlTemp
    }

    public componentWillReceiveProps(nextProps) {
        const { actions, currentId, getActions, openDialog, schema, repository } = this.props
        if ((nextProps.currentContent.Id && (currentId === 'login' || currentId !== nextProps.currentId)) && actions.length === 0) {
            getActions(nextProps.currentContent.Id)
        }
        if (this.props.actions.length !== nextProps.actions.length) {
            const optionList = []
            const folderList = []
            nextProps.actions.map((action, index) => {
                const newDisplayName = `New ${action.DisplayName}`
                action.DisplayName = newDisplayName
                action.Action = () => {
                    openDialog(
                        <NewView path={nextProps.currentContent.Path} repository={this.props.repository} schema={this.props.schema} />,
                        newDisplayName, DMSActions.closeDialog)
                }
                if (action.DisplayName.indexOf('Folder') > -1) {
                    folderList.push(action)
                } else {
                    optionList.push(action)
                }
            })
            this.setState({
                options: [...optionList, ...folderList],
            })
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

const mapStateToProps = (state) => {
    return {
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
        actions: DMSReducers.getAddNewTypeList(state.dms.actionmenu),
        schema: Reducers.getSchema(state.sensenet),
        repository: state.sensenet.session.repository,
    }
}

export default connect(mapStateToProps, {
    getActions: DMSActions.loadTypesToAddNewList,
    closeActionMenu: DMSActions.closeActionMenu,
    openActionMenu: DMSActions.openActionMenu,
    openDialog: DMSActions.openDialog,
})(AddNewMenu)
