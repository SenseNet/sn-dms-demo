import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import MenuList from '@material-ui/core/MenuList'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import { Workspace } from '@sensenet/default-content-types'
import * as React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import WorkspaceListItem from './WorkspaceListItem'
import WorkspaceSearch from './WorkspaceSearch'

const styles = () => ({
    workspaceList: {
        padding: 0,
        margin: 0,
        overflowY: 'auto',
    },
    toolbar: {
        padding: 10,
        flexGrow: 1,
        minHeight: 'auto',
    },
    button: {
        'fontSize': 15,
        'margin': 0,
        'padding': 0,
        'minWidth': 'auto',
        'color': '#fff',
        '&:hover': {
            backgroundColor: '#016d9e',
        },
    },
})

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

interface WorkspaceListProps {
    closeDropDown: (open: boolean) => void,
}

class WorkspaceList extends React.Component<{ classes } & WorkspaceListProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, WorkspaceListState> {
    public state = {
        workspaces: this.props.workspaces,
        orderedWsList: null,
        favorites: this.props.favorites,
        top: 0,
        term: '',
    }
    constructor(props) {
        super(props)
        this.handleCloseClick = this.handleCloseClick.bind(this)
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
            orderedWsList: newProps.term.length > 0 ? [...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) > -1), ...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) === -1)].filter((ws) => ws.DisplayName.includes(newProps.term) || ws.Name.includes(newProps.term)) :
                [...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) > -1), ...newProps.workspaces.filter((ws) => newProps.favorites.indexOf(ws.Id) === -1)],
            term: newProps.term,
        } as WorkspaceList['state']
    }
    public handleSearch = (text) => {
        this.props.searchWorkspaces(text)
    }
    public handleCloseClick = () => {
        this.props.closeDropDown(true)
    }
    public render() {
        const { orderedWsList, favorites } = this.state
        const { classes } = this.props
        return (
            <div>
                <Toolbar className={classes.toolbar}>
                    <div style={{ flexGrow: 1 }}>

                        <WorkspaceSearch handleKeyup={this.handleSearch} />
                    </div>
                    <Button
                        disableRipple={true}
                        disableFocusRipple={true}
                        className={classes.button}
                        onClick={() => this.handleCloseClick()}>
                        <CloseIcon />
                    </Button>
                </Toolbar>
                <Scrollbars
                    style={{ height: window.innerHeight - 220, width: 'calc(100% - 1px)' }}
                    renderThumbVertical={({ style }) => <div style={{ ...style, borderRadius: 2, backgroundColor: '#fff', width: 10, marginLeft: -2 }}></div>}
                    thumbMinSize={180}>
                    <MenuList className={classes.workspaceList}>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(WorkspaceList))
