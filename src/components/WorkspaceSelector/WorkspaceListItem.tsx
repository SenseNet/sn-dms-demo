import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import StarIcon from '@material-ui/icons/Star'
import { Workspace } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'

const styles = {
    listItem: {
        listStyleType: 'none',
        borderTop: 'solid 1px #2080aa',
        padding: '12px 12px 12px 0px',
    },
    listItemRoot: {
        padding: 0,
    },
    primary: {
        'fontFamily': 'Raleway ExtraBold',
        'fontSize': 15,
        'lineHeight': '24px',
        'color': '#fff',
        'background': 'none',
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    icon: {
        margin: 0,
        color: '#fff',
    },
    iconButton: {
        'margin': 0,
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    followedIconButton: {
        margin: 0,
        padding: 0,
        color: '#ffeb3b',
    },
}

interface WorkspaceListItemProps extends RouteComponentProps<any> {
    followed: boolean,
    workspace: Workspace,
    userName,
    favorites: number[],
    closeDropDown: (open: boolean) => void,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        userName: state.sensenet.session.user.userName,
        options: state.sensenet.currentitems.options,
    }
}

const mapDispatchToProps = {
    followWorkspace: DMSActions.followWorkspace,
    unfollowWorkspace: DMSActions.unfollowWorkspace,
    loadContent: Actions.loadContent,
    fetchContent: Actions.requestContent,
}

interface WorkspaceListItemState {
    followed: boolean,
}

class WorkspaceListItem extends React.Component<{ classes } & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & WorkspaceListItemProps, WorkspaceListItemState> {
    public state = {
        followed: this.props.followed,
    }
    constructor(props: WorkspaceListItem['props']) {
        super(props)

        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }
    public handleClick = (path) => {
        const doclibPath = `${path}/Document_Library`
        const newPath = compile(this.props.match.path)({ folderPath: btoa(doclibPath) })
        this.props.history.push(newPath)
        this.props.closeDropDown(true)
    }
    public startButtonClick = (id) => {
        const { userName, favorites, followWorkspace, unfollowWorkspace } = this.props
        this.state.followed ? unfollowWorkspace(userName, id, favorites) : followWorkspace(userName, id, favorites)
        this.setState({
            followed: !this.state.followed,
        })
    }
    public handleMouseOver = (e) => e.currentTarget.style.backgroundColor = '#01A1EA'
    public handleMouseLeave = (e) => e.currentTarget.style.backgroundColor = 'transparent'
    public render() {
        const { classes, workspace, followed } = this.props
        return (
            <MenuItem
                onClick={() => this.handleClick(workspace.Path)}
                onMouseOver={(e) => this.handleMouseOver(e)}
                onMouseLeave={(e) => this.handleMouseLeave(e)}
                style={styles.listItem}>
                <ListItemIcon className={classes.icon}>
                    <IconButton
                        className={followed ? classes.followedIconButton : classes.iconButton}
                        onClick={() => this.startButtonClick(workspace.Path)}>
                        <StarIcon />
                    </IconButton>
                </ListItemIcon>
                <ListItemText
                    classes={{ primary: classes.primary, root: classes.listItemRoot }}
                    primary={workspace.DisplayName}
                    onClick={() => this.handleClick(workspace.Path)} />
            </MenuItem>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WorkspaceListItem)))
