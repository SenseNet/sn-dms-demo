import { Divider, Icon, ListItemText, MenuItem, StyleRulesCallback, withStyles } from '@material-ui/core'
import * as React from 'react'
import { AddNewButton } from './AddNewButton'

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
    iconWhite: {
        color: '#fff',
        background: '#666',
        borderRadius: '50%',
        fontSize: '14px',
        padding: 4,
    },
    iconWhiteActive: {
        color: '#fff',
        background: '#016d9e',
        borderRadius: '50%',
        fontSize: '14px',
        padding: 4,
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
    open: {
        display: 'block',
    },
    closed: {
        display: 'none',
    },
})

interface UsersMenuProps {
    active,
    classes,
    item,
    chooseMenuItem,
    chooseSubmenuItem,
}

class UsersMenu extends React.Component<UsersMenuProps, {}> {
    public handleMenuItemClick = (title) => {
        this.props.chooseMenuItem(title)
    }
    public handleSubmenuItemClick = (title) => {
        this.props.chooseSubmenuItem(title)
    }
    public render() {
        const { active, classes, item } = this.props
        return (
            <div>
                <MenuItem
                    selected={active}
                    classes={{ root: classes.root, selected: classes.selected }}
                    onClick={(e) => this.handleMenuItemClick('users')}>
                    <Icon className={active ? classes.iconWhiteActive : classes.iconWhite} color="primary">
                        {item.icon}
                    </Icon>
                    <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} inset primary={item.title} />
                </MenuItem>
                <div className={active ? classes.open : classes.closed}>
                    <Divider />
                    <AddNewButton contentType="User" />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(UsersMenu)
