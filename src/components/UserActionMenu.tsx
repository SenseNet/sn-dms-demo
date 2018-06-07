import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSReducers from '../Reducers'
import UserPanel from './UserPanel'

import { icons } from '../assets/icons'

interface UserActionMenu {
    loggedinUser,
    logout
}

import { resources } from '../assets/resources'

const actions = [
    {
        name: 'Profile',
        displayName: resources.MYPROFILE,
        Icon: 'profile',
    },
    {
        name: 'Settings',
        displayName: resources.SETTINGS,
        Icon: 'settings',
    },
    {
        name: 'Logout',
        displayName: resources.LOGOUT,
        Icon: 'logout',
    },
]

const styles = {
    actionmenuContainer: {
        flex: 1,
    },
    menuIcon: {
        color: '#fff',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer',
    },
    menuIconMobile: {
        width: 'auto' as any,
        marginLeft: '16px',
    },
    arrowButton: {
        marginLeft: 0,
    },
    menu: {
        marginTop: 30,
        padding: 0,
    },
    menuItem: {
        padding: '6px 15px',
        fontSize: '0.9rem',
    },
    avatar: {
        display: 'inline-block',
    },
    actionIcon: {
        color: '#016D9E',
        marginRight: 14,
    },
}

class UserActionMenu extends React.Component<UserActionMenu, { anchorEl, open, selectedIndex }> {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            open: false,
            selectedIndex: 1,
        }
    }
    public handleClick = (event) => {
        this.setState({ open: true, anchorEl: event.currentTarget })
    }

    public handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, open: false })
        const actionName = actions[index].name.toLocaleLowerCase()
        const action = this.props[actionName]
        action()
    }

    public handleRequestClose = () => {
        this.setState({ open: false })
    }
    public render() {
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <div style={matches ? null : styles.actionmenuContainer}>
                        <UserPanel user={this.props.loggedinUser} style={styles.avatar} />
                        <ArrowDropDown
                            onClick={this.handleClick}
                            style={matches ? styles.menuIcon : { ...styles.menuIcon, ...styles.menuIconMobile }} />
                        <Menu
                            id="long-menu"
                            anchorEl={this.state.anchorEl}
                            open={this.state.open}
                            onClose={this.handleRequestClose}
                            style={styles.menu}
                        >
                            {actions.map((action, index) => (
                                <MenuItem
                                    key={action.name}
                                    selected={index === this.state.selectedIndex}
                                    onClick={(event) => this.handleMenuItemClick(event, index)}
                                    style={styles.menuItem}>
                                    <ListItemIcon style={styles.actionIcon}>
                                        <Icon color="primary">{
                                            action.Icon === 'Application' ?
                                                icons[action.name.toLowerCase()] :
                                                icons[action.Icon.toLowerCase()]
                                        }</Icon>
                                    </ListItemIcon>
                                    {action.displayName}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                }}
            </MediaQuery>
        )
    }
}

const userLogout = Actions.userLogout

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
    }
}

export default connect(mapStateToProps, {
    logout: userLogout,
})(UserActionMenu)
