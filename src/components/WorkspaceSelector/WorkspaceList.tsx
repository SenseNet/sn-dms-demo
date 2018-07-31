import MenuList from '@material-ui/core/MenuList'
import { Workspace } from '@sensenet/default-content-types'
import * as React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import WorkspaceListItem from './WorkspaceListItem'

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
    }
}

const mapDispatchToProps = {
    getWorkspaces: DMSActions.getWorkspaces,
    getFavorites: DMSActions.loadFavoriteWorkspaces,
}

interface WorkspaceListState {
    workspaces: Workspace[],
    orderedWsList: [],
    top,
}

class WorkspaceList extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, WorkspaceListState> {
    public state = {
        workspaces: this.props.workspaces,
        orderedWsList: null,
        favorites: this.props.favorites,
        top: 0,
    }
    constructor(props) {
        super(props)
    }
    public static getDerivedStateFromProps(newProps: WorkspaceList['props'], lastState: WorkspaceList['state']) {
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
            orderedWsList: [...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) > -1), ...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) === -1)],
        } as WorkspaceList['state']
    }
    public render() {
        const { orderedWsList, favorites } = this.state
        return (
            <Scrollbars
                style={{ height: window.innerHeight - 220, width: 'calc(100% - 1px)' }}
                renderThumbVertical={({style}) => <div style={{...style, borderRadius: 2, backgroundColor: '#fff', width: 10, marginLeft: -2 }}></div>}
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
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceList)
