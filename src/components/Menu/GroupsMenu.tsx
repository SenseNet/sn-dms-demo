import { Icon, ListItemText, MenuItem, StyleRulesCallback, withStyles } from '@material-ui/core'
import * as React from 'react'

const styles: StyleRulesCallback = (theme) => ({
    primary: {
        color: '#666',
        fontFamily: 'Raleway Semibold',
        fontSize: '14px',
    },
    primaryActive: {
        color: '#016d9e',
        fontFamily: 'Raleway Semibold',
        fontSize: '14px',
    },
    icon: {
        color: '#666',
        fontSize: 26,
        marginLeft: -2,
    },
    iconActive: {
        color: '#016d9e',
        fontSize: 26,
        marginLeft: -2,
    },
    root: {
        color: '#666',
        paddingLeft: 0,
        paddingRight: 0,
    },
    selected: {
        backgroundColor: '#fff !important',
        color: '#016d9e',
        fontWeight: 600,
        paddingLeft: 0,
        paddingRight: 0,
    },
})

class GroupsMenu extends React.Component<{
    active, classes,
    chooseMenuItem,
    chooseSubmenuItem,
}, {}> {
    public handleMenuItemClick = (title) => {
        this.props.chooseMenuItem(title)
    }
    public handleSubmenuItemClick = (title) => {
        this.props.chooseSubmenuItem(title)
    }
    public render() {
        const { active, classes } = this.props
        return (
            <MenuItem
                selected={active}
                classes={{ root: classes.root, selected: classes.selected }}
                onClick={(e) => this.handleMenuItemClick('groups')}>
                <Icon className={active ? classes.iconActive : classes.icon} color="primary">
                    supervised_user_circle
                        </Icon>
                <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} inset primary="Groups" />
            </MenuItem>
        )
    }
}

export default withStyles(styles)(GroupsMenu)
