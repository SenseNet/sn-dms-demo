import { Divider, Icon, ListItemText, MenuItem, StyleRulesCallback, withStyles } from '@material-ui/core'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
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
    icon: {
        color: '#666',
        fontSize: 26,
        marginLeft: -2,
    },
    iconMobile: {
        color: '#016d9e',
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
    rootMobile: {
        color: '#666',
        paddingLeft: 20,
        paddingRight: 20,
    },
    selectedMobile: {
        backgroundColor: '#fff !important',
        color: '#016d9e',
        fontWeight: 600,
        paddingLeft: 20,
        paddingRight: 20,
    },
    open: {
        display: 'block',
    },
    closed: {
        display: 'none',
    },
})

interface GroupsMenuProps extends RouteComponentProps<any> {
    active,
    classes,
    item,
    chooseMenuItem,
    chooseSubmenuItem,
    matches
}

class GroupsMenu extends React.Component<GroupsMenuProps, {}> {
    public handleMenuItemClick = (title) => {
        this.props.history.push('/groups')
        this.props.chooseMenuItem(title)
    }
    public handleSubmenuItemClick = (title) => {
        this.props.history.push(`/groups/${title}`)
        this.props.chooseSubmenuItem(title)
    }
    public handleButtonClick = (e) => {
        // TODO
    }
    public render() {
        const { active, classes, item, matches } = this.props
        return (
            <div>
                <MenuItem
                    selected={active}
                    classes={matches ? { root: classes.root, selected: classes.selected } : { root: classes.rootMobile, selected: classes.selectedMobile }}
                    onClick={(e) => this.handleMenuItemClick('groups')}>
                    <Icon className={matches ? active ? classes.iconActive : classes.icon : active ? classes.iconActive : classes.iconMobile} color="primary">
                        {item.icon}
                    </Icon>
                    <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} inset primary={item.title} />
                </MenuItem>
                <div className={active ? classes.open : classes.closed}>
                    <Divider />
                    <AddNewButton contentType="Group" onClick={(e) => this.handleButtonClick(e)} />
                </div>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(GroupsMenu))
