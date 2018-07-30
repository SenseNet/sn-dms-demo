import Collapse from '@material-ui/core/Collapse'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { WorkspaceList } from './WorkspaceList'
import { WorkspaceSearch } from './WorkspaceSearch'
import WorkspaceSelectorToolbar from './WorspaceSelectorToolbar'

const styles = (theme) => ({
    container: {
        position: 'absolute',
        zIndex: 10,
        width: 450,
    },
    paper: {
        background: '#016d9e',
    },
    inner: {
        overflowY: 'auto',
    },
})

interface WorkspaceDropDownProps {
    open: boolean,
    closeDropDown: (open: boolean) => void,
}

class WorkspaceDropDown extends React.Component<{ classes } & WorkspaceDropDownProps, {}> {
    public render() {
        const { open, classes } = this.props
        return (
            <Collapse in={open} className={classes.container}>
                <Paper elevation={4} className={classes.paper}>
                    <WorkspaceSelectorToolbar closeDropdDown={this.props.closeDropDown} />
                    <div className={classes.inner}>
                        <WorkspaceSearch />
                        <WorkspaceList />
                    </div>
                </Paper>
            </Collapse>
        )
    }
}

export default withStyles(styles as any)(WorkspaceDropDown)
