import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../Actions'
import * as DMSReducers from '../Reducers'
import UserPanel from './UserPanel'

interface UserActionMenu {
    loggedinUser,
    logout,
    loadUserActions,
    actions,
    openActionMenu,
    closeActionMenu,
}

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
    avatar: {
        display: 'inline-block',
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
        this.handleClick = this.handleClick.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
    }
    public componentWillReceiveProps(nextProps) {
        const { loggedinUser, loadUserActions } = this.props
        if (loggedinUser.userName !== nextProps.loggedinUser.userName && nextProps.loggedinUser.userName !== 'Visitor') {
            loadUserActions(`/Root/IMS/Public/${nextProps.loggedinUser.userName}`, 'DMSUserActions')
        }
    }
    public handleClick = (e) => {
        const { actions, loggedinUser } = this.props
        this.props.closeActionMenu()
        this.props.openActionMenu(actions, loggedinUser.userName, loggedinUser.fullName, e.currentTarget, {
            top: e.currentTarget.offsetTop + 40,
            left: e.currentTarget.offsetLeft,
        })
    }

    public handleRequestClose = () => {
        this.setState({ open: false })
    }
    public render() {
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <div
                        style={matches ? null : styles.actionmenuContainer}
                        aria-owns="actionmenu"
                        onClick={(e) => this.handleClick(e)}>
                        <UserPanel user={this.props.loggedinUser} style={styles.avatar} />
                        <ArrowDropDown
                            style={matches ? styles.menuIcon : { ...styles.menuIcon, ...styles.menuIconMobile }} />
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
        actions: DMSReducers.getUserActions(state.dms.actionmenu),
    }
}

export default connect(mapStateToProps, {
    logout: userLogout,
    loadUserActions: DMSActions.loadUserActions,
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
})(UserActionMenu)
