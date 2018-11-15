import Collapse from '@material-ui/core/Collapse'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'
import GroupList from './GroupList'

const styles = (theme) => ({
    wsSelectorContainer: {
        position: 'absolute',
        zIndex: 10,
        width: 450,
    },
    wsSelectorContainerMobile: {
        position: 'absolute',
        width: window.innerWidth,
        zIndex: 10,
        left: 0,
        top: 0,
    },
    wsSelectorPaper: {
        background: '#016d9e',
    },
    wsSelectorInner: {
        overflowY: 'auto',
        padding: 0,
    },
})

interface GroupDropDownProps {
    open: boolean,
    closeDropDown: (open: boolean) => void,
    matches,
}

class GroupDropDown extends React.Component<{ classes } & GroupDropDownProps, {}> {
    public render() {
        const { open, classes, matches } = this.props
        return (
            <Collapse in={open} className={matches ? classes.wsSelectorContainer :  classes.wsSelectorContainerMobile}>
                <Paper elevation={4} className={classes.wsSelectorPaper}>
                    <div>
                        <div className={classes.wsSelectorInner}>
                            <GroupList matches={matches} closeDropDown={this.props.closeDropDown} />
                        </div>
                    </div>
                </Paper>
            </Collapse>
        )
    }
}

export default withStyles(styles as any)(GroupDropDown)
