import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import TrashIcon from '@material-ui/icons/Delete'
import * as React from 'react'
import SharedWorkspaces from './SharedWorkspaces'

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
        color: '#fff',
    },
    iconSmall: {
        fontSize: 20,
    },
})

interface WorkspaceSelectorToolbarProps {
    closeDropdDown: (open: boolean) => void,
}

class WorkspaceSelectorToolbar extends React.Component<{ classes } & WorkspaceSelectorToolbarProps, {}> {
    public handleClick = () => {
        this.props.closeDropdDown(true)
    }
    public render() {
        const { classes } = this.props
        return (
            <Toolbar className={classes.toolbar}>
                <div style={{ flexGrow: 1 }}>
                    <SharedWorkspaces />
                    <Button disableRipple={true} disableFocusRipple={true} className={classes.trashButton}>
                        <TrashIcon className={classes.leftIcon} />
                        {resources.TRASH}
                    </Button>
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

export default withStyles(styles)(WorkspaceSelectorToolbar)
