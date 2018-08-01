import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import LocationCityIcon from '@material-ui/icons/LocationCity'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import { resources } from '../../assets/resources'

const styles = (theme) => ({
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
    trashButton: {
        'fontSize': 15,
        'margin': 0,
        'padding': 0,
        'minWidth': 'auto',
        'color': '#fff',
        '&:hover': {
            backgroundColor: '#016d9e',
        },
        'marginLeft': 30,
    },
    leftIcon: {
        'margin': '0',
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    iconSmall: {
        fontSize: 20,
    },
    currentWs: {
        fontFamily: 'Raleway ExtraBold',
        fontSize: 16,
    },
    listItemRoot: {
        padding: 0,
    },
    primary: {
        'fontFamily': 'Raleway ExtraBold',
        'fontSize': 16,
        'lineHeight': '24px',
        'color': '#fff',
        'background': 'none',
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    icon: {
        margin: '0 0 0 -12px',
        color: '#fff',
    },
    toolbarContainer: {
        margin: 0,
        padding: 0,
    },
})

interface WorkspaceSelectorToolbarProps {
    closeDropdDown: (open: boolean) => void,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        currentworkspace: state.sensenet.currentworkspace,
        userName: state.sensenet.session.user.userName,
    }
}

class WorkspaceSelectorToolbar extends React.Component<{ classes } & ReturnType<typeof mapStateToProps> & WorkspaceSelectorToolbarProps, {}> {
    public handleClick = () => {
        this.props.closeDropdDown(true)
    }
    public render() {
        const { classes, currentworkspace, userName } = this.props
        return (
            <Toolbar className={classes.toolbar}>
                <div style={{ flexGrow: 1 }}>
                    <ListItem className={classes.toolbarContainer}>
                        <ListItemIcon className={classes.icon}>
                            <IconButton
                                className={classes.leftIcon}>
                                <LocationCityIcon />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText
                            classes={{ primary: classes.primary, root: classes.listItemRoot }}
                            primary={currentworkspace.Path.includes('Profiles', userName) ? resources.MYPROFILE : currentworkspace.DisplayName} />
                    </ListItem >
                </div>
                <Button
                    disableRipple={true}
                    disableFocusRipple={true}
                    className={classes.button}
                    onClick={() => this.handleClick()}>
                    <CloseIcon />
                </Button>
            </Toolbar>
        )
    }
}

export default connect(mapStateToProps)(withStyles(styles)(WorkspaceSelectorToolbar))
