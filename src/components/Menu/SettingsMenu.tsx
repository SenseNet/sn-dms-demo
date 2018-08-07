import { Icon, ListItemText, MenuItem, MenuList, StyleRulesCallback, withStyles } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { resources } from '../../assets/resources'

const subMenu = [
    {
        title: resources.COMMON,
        name: 'commonsettings',
        icon: 'settings',
    },
    {
        title: resources.AD_SYNC,
        name: 'adsync',
        icon: 'settings',
    },
    {
        title: resources.PREVIEW,
        name: 'preview',
        icon: 'settings',
    },
]

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
    primarySub: {
        color: '#666',
        fontFamily: 'Raleway Semibold',
        fontSize: '13px',
    },
    primarySubActive: {
        color: '#016d9e',
        fontFamily: 'Raleway Semibold',
        fontSize: '13px',
    },
    iconWhite: {
        color: '#fff',
        background: '#666',
        borderRadius: '50%',
        fontSize: '16px',
        padding: 3,
    },
    iconWhiteActive: {
        color: '#fff',
        background: '#016d9e',
        borderRadius: '50%',
        fontSize: '16px',
        padding: 3,
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
    submenu: {
        padding: 0,
    },
    submenuItem: {
        paddingLeft: 0,
        paddingRight: 0,
        borderTop: 'solid 1px rgba(0, 0, 0, 0.08)',
    },
    submenuIcon: {
        color: '#666',
        fontSize: '21px',
        padding: 1.5,
    },
    submenuIconActive: {
        color: '#016d9e',
        fontSize: '21px',
        padding: 1.5,
    },
    submenuItemText: {
        fontSize: '13px',
        fontFamily: 'Raleway Semibold',
    },
})

interface SettingsMenuProps extends RouteComponentProps<any> {
    active,
    classes,
    subactive,
    item,
    chooseMenuItem,
    chooseSubmenuItem
}

class SettingsMenu extends React.Component<SettingsMenuProps, {}> {
    public handleMenuItemClick = (title) => {
        this.props.history.push('/settings')
        this.props.chooseMenuItem(title)
    }
    public handleSubmenuItemClick = (title) => {
        this.props.history.push(`/settings/${title}`)
        this.props.chooseSubmenuItem(title)
    }
    public render() {
        const { active, subactive, classes, item } = this.props
        return (
            <div>
                <MenuItem
                    selected={active}
                    classes={{ root: classes.root, selected: classes.selected }}
                    onClick={(e) => this.handleMenuItemClick('settings')}>
                    <Icon className={active ? classes.iconWhiteActive : classes.iconWhite} color="primary">
                        {item.icon}
                    </Icon>
                    <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} inset primary={item.title} />
                </MenuItem>
                <div className={active ? classes.open : classes.closed}>
                    <MenuList className={classes.submenu}>
                        {subMenu.map((menuitem, index) => {
                            return (<MenuItem className={classes.submenuItem} key={index}
                                onClick={(e) => this.handleSubmenuItemClick(menuitem.name)}>
                                <Icon className={subactive === menuitem.name ? classes.submenuIconActive : classes.submenuIcon}>
                                    {menuitem.icon}
                                </Icon>
                                <ListItemText classes={{ primary: subactive === menuitem.name ? classes.primarySubActive : classes.primarySub }} inset primary={menuitem.title} />
                            </MenuItem>)
                        })}
                    </MenuList>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        subactive: state.dms.menu.activeSubmenu,
    }
}

export default withRouter(connect(mapStateToProps, {})(withStyles(styles)(SettingsMenu)))
