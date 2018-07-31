import MenuList from '@material-ui/core/MenuList'
import { Workspace } from '@sensenet/default-content-types'
import * as React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import WorkspaceListItem from './WorkspaceListItem'
import WorkspaceSearch from './WorkspaceSearch'

const styles = {
    workspaceList: {
        padding: 0,
        margin: 0,
        overflowY: 'auto',
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        workspaces: state.dms.workspaces.all,
        favorites: state.dms.workspaces.favorites,
        user: state.sensenet.session.user,
        term: state.dms.workspaces.searchTerm,
    }
}

const mapDispatchToProps = {
    getWorkspaces: DMSActions.getWorkspaces,
    getFavorites: DMSActions.loadFavoriteWorkspaces,
    searchWorkspaces: DMSActions.searchWorkspaces,
}

interface WorkspaceListState {
    workspaces: Workspace[],
    orderedWsList: [],
    top: number,
    term: string,
}

class WorkspaceList extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, WorkspaceListState> {
    public state = {
        workspaces: this.props.workspaces,
        orderedWsList: null,
        favorites: this.props.favorites,
        top: 0,
        term: '',
    }
    constructor(props) {
        super(props)
    }
    public static getDerivedStateFromProps(newProps: WorkspaceList['props'], lastState: WorkspaceList['state']) {
        console.log(newProps.term)
        if (newProps.workspaces.length !== lastState.workspaces.length || lastState.workspaces.length === 0) {
            newProps.getWorkspaces()
        }
        if (lastState.orderedWsList === null || (newProps.favorites.length === 0 && lastState.orderedWsList.length === 0)) {
            newProps.getFavorites(newProps.user.userName)
        }
        return {
            ...lastState,
            workspaces: newProps.workspaces,
            favorites: newProps.favorites,
            orderedWsList: newProps.term.length > 0 && newProps.term !== lastState.term ? [...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) > -1), ...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) === -1)].filter((ws) => ws.DisplayName.includes(newProps.term) || ws.Name.includes(newProps.term)) :
            [...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) > -1), ...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) === -1)],
            term: newProps.term,
        } as WorkspaceList['state']
    }
    public handleSearch = (text) => {
        this.props.searchWorkspaces(text)
    }
    public render() {
        const { orderedWsList, favorites } = this.state
        return (
            <div>
                <WorkspaceSearch handleKeyup={this.handleSearch} />
                <Scrollbars
                    style={{ height: window.innerHeight - 220, width: 'calc(100% - 1px)' }}
                    renderThumbVertical={({ style }) => <div style={{ ...style, borderRadius: 2, backgroundColor: '#fff', width: 10, marginLeft: -2 }}></div>}
                    thumbMinSize={180}>
                    <MenuList style={styles.workspaceList as any}>
                        {orderedWsList.map((workspace) => <WorkspaceListItem
                            key={workspace.Id}
                            workspace={workspace}
                            favorites={favorites}
                            followed={favorites.indexOf(workspace.Id) > -1}
                        />)}
                    </MenuList>
                </Scrollbars>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceList)
