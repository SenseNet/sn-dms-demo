import { Divider, Drawer, MenuList, StyleRulesCallback, withStyles } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as DMSActions from '../Actions'
import { resources } from '../assets/resources'
import { getActiveMenuItem } from '../Reducers'
import ContentTemplatesMenu from './Menu/ContentTemplatesMenu'
import ContentTypesMenu from './Menu/ContentTypesMenu'
import DocumentsMenu from './Menu/DocumentsMenu'
import GroupsMenu from './Menu/GroupsMenu'
import SettingsMenu from './Menu/SettingsMenu'
import UsersMenu from './Menu/UsersMenu'

const menu: Array<{ title: string, name: string, icon: string, component: any, routeName: string }> = [
    {
        title: resources.DOCUMENTS,
        name: 'documents',
        icon: 'folder',
        component: DocumentsMenu,
        routeName: '/documents',
    },
    {
        title: resources.USERS,
        name: 'users',
        icon: 'person',
        component: UsersMenu,
        routeName: '/users',
    },
    {
        title: resources.GROUPS,
        name: 'groups',
        icon: 'supervised_user_circle',
        component: GroupsMenu,
        routeName: '/groups',
    },
    {
        title: resources.CONTENT_TYPES,
        name: 'contenttypes',
        icon: 'edit',
        component: ContentTypesMenu,
        routeName: '/contenttypes',
    },
    {
        title: resources.CONTENT_TEMPLATES,
        name: 'contenttemplates',
        icon: 'view_quilt',
        component: ContentTemplatesMenu,
        routeName: '/contenttemplates',
    },
    {
        title: resources.SETTINGS,
        name: 'settings',
        icon: 'settings',
        component: SettingsMenu,
        routeName: '/settings',
    },
]

const drawerWidth = 185

const styles: StyleRulesCallback = (theme) => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        padding: '0 10px',
    },
})

interface DashboarDrawerProps {
    classes,
    chooseMenuItem,
    chooseSubmenuItem,
    activeItem,
}

class DashboardDrawer extends React.Component<DashboarDrawerProps, {}> {
    public handleClick = (name) => {
        this.props.chooseMenuItem(name)
    }
    public render() {
        const { classes, activeItem, chooseMenuItem, chooseSubmenuItem } = this.props
        return <Drawer
            variant="permanent"
            open={true}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div style={{ height: 48 }}></div>

            <MenuList>
                {menu.map((item, index) => {
                    return (
                        <div key={index}>
                            <Link to={item.routeName} style={{ textDecoration: 'none' }}>
                                {
                                    React.createElement(
                                        item.component,
                                        {
                                            active: activeItem === item.name,
                                            item,
                                            chooseMenuItem,
                                            chooseSubmenuItem,
                                        })
                                }
                            </Link>

                            <Divider light />
                        </div>
                    )
                })}
            </MenuList>
        </Drawer>
    }
}

const mapStateToProps = (state) => {
    return {
        activeItem: getActiveMenuItem(state.dms.menu),
    }
}

export default (connect(mapStateToProps, {
    chooseMenuItem: DMSActions.chooseMenuItem,
    chooseSubmenuItem: DMSActions.chooseSubmenuItem,
})(withStyles(styles)(DashboardDrawer)))
