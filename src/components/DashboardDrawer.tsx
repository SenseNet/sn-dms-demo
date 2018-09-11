import { Divider, Drawer, MenuList, StyleRulesCallback, withStyles } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { resources } from '../assets/resources'
import ContentTemplatesMenu from './Menu/ContentTemplatesMenu'
import ContentTypesMenu from './Menu/ContentTypesMenu'
import DocumentsMenu from './Menu/DocumentsMenu'
import GroupsMenu from './Menu/GroupsMenu'
import SettingsMenu from './Menu/SettingsMenu'
import UsersMenu from './Menu/UsersMenu'

const menu: Array<{ title: string, name: string, icon: string, component: any, routeName: string, mobile: boolean }> = [
    {
        title: resources.DOCUMENTS,
        name: 'documents',
        icon: 'folder',
        component: DocumentsMenu,
        routeName: '/documents',
        mobile: true,
    },
    {
        title: resources.USERS,
        name: 'users',
        icon: 'person',
        component: UsersMenu,
        routeName: '/users',
        mobile: true,
    },
    {
        title: resources.GROUPS,
        name: 'groups',
        icon: 'supervised_user_circle',
        component: GroupsMenu,
        routeName: '/groups',
        mobile: true,
    },
    {
        title: resources.CONTENT_TYPES,
        name: 'contenttypes',
        icon: 'edit',
        component: ContentTypesMenu,
        routeName: '/contenttypes',
        mobile: false,
    },
    {
        title: resources.CONTENT_TEMPLATES,
        name: 'contenttemplates',
        icon: 'view_quilt',
        component: ContentTemplatesMenu,
        routeName: '/contenttemplates',
        mobile: false,
    },
    {
        title: resources.SETTINGS,
        name: 'settings',
        icon: 'settings',
        component: SettingsMenu,
        routeName: '/settings',
        mobile: true,
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

const mapStateToProps = (state: rootStateType) => {
    return {
        activeItem: state.dms.menu.active,
        menuIsOpen: state.dms.menuOpen,
    }
}

const mapDispatchToProps = {
    chooseMenuItem: DMSActions.chooseMenuItem,
    chooseSubmenuItem: DMSActions.chooseSubmenuItem,
}

class DashboardDrawer extends React.Component<DashboarDrawerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleClick = (name) => {
        this.props.chooseMenuItem(name)
    }
    public render() {
        const { classes, activeItem, chooseMenuItem, chooseSubmenuItem } = this.props
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return <Drawer
                    variant={matches ? 'permanent' : 'temporary'}
                    open={matches ? true : this.props.menuIsOpen}
                    classes={{
                        paper: matches ? classes.drawerPaper : null,
                    }}
                >
                    { matches ? <div style={{ height: 48 }}></div> : null }

                    <MenuList>
                        {menu.map((item, index) => {
                            return matches ? (
                                <div key={index}>
                                    {
                                        React.createElement(
                                            item.component,
                                            {
                                                active: activeItem === item.name,
                                                item,
                                                chooseMenuItem,
                                                chooseSubmenuItem,
                                                matches,
                                            })
                                    }
                                    <Divider light />
                                </div>
                            ) :
                                item.mobile ? <div key={index}>
                                    {
                                        React.createElement(
                                            item.component,
                                            {
                                                active: activeItem === item.name,
                                                item,
                                                chooseMenuItem,
                                                chooseSubmenuItem,
                                                matches,
                                            })
                                    }
                                    <Divider light />
                                </div> : null
                        })}
                    </MenuList>
                </Drawer>
            }}
        </MediaQuery>
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardDrawer)))
