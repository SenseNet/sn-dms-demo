import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import StarIcon from '@material-ui/icons/Star'
import { Workspace } from '@sensenet/default-content-types'
import * as React from 'react'

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
}

interface WorkspaceListItemProps {
    workspace: Workspace,
}

class WorkspaceListItem extends React.Component<{ classes } & WorkspaceListItemProps, {}> {
    constructor(props: WorkspaceListItem['props']) {
        super(props)

        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }
    public handleClick = (id) => {
        // TODO: load ws
    }
    public startButtonClick = (id) => {
        // TODO: call followWs
    }
    public handleMouseOver = (e) => e.currentTarget.style.backgroundColor = '#01A1EA'
    public handleMouseLeave = (e) => e.currentTarget.style.backgroundColor = 'transparent'
    public render() {
        const { classes, workspace } = this.props
        return (
            <MenuItem
                onClick={() => this.handleClick(workspace.Id)}
                onMouseOver={(e) => this.handleMouseOver(e)}
                onMouseLeave={(e) => this.handleMouseLeave(e)}
                style={styles.listItem}>
                <ListItemIcon className={classes.icon}>
                    <IconButton className={classes.iconButton}>
                        <StarIcon />
                    </IconButton>
                </ListItemIcon>
                <ListItemText classes={{ primary: classes.primary, root: classes.listItemRoot }} primary={workspace.DisplayName} />
            </MenuItem>
        )
    }
}

export default withStyles(styles)(WorkspaceListItem)
