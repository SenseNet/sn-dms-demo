import { Divider, Drawer, MenuList, StyleRulesCallback, withStyles } from '@material-ui/core'
import { IContent } from '@sensenet/client-core'
import { getCurrentContent } from '@sensenet/redux/dist/Reducers'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../Actions'
import { resources } from '../assets/resources'
import { getActiveMenuItem } from '../Reducers'
import ContentTemplatesMenu from './Menu/ContentTemplatesMenu'
import ContentTypesMenu from './Menu/ContentTypesMenu'
import DocumentsMenu from './Menu/DocumentsMenu'
import GroupsMenu from './Menu/GroupsMenu'
import SettingsMenu from './Menu/SettingsMenu'
import UsersMenu from './Menu/UsersMenu'

const menu = [
    {
        title: resources.DOCUMENTS,
        name: 'documents',
        icon: 'folder',
        component: DocumentsMenu,
    },
    {
        title: resources.USERS,
        name: 'users',
        icon: 'person',
        component: UsersMenu,
    },
    {
        title: resources.GROUPS,
        name: 'groups',
        icon: 'supervised_user_circle',
        component: GroupsMenu,
    },
    {
        title: resources.CONTENT_TYPES,
        name: 'contenttypes',
        icon: 'edit',
        component: ContentTypesMenu,
    },
    {
        title: resources.CONTENT_TEMPLATES,
        name: 'contenttemplates',
        icon: 'view_quilt',
        component: ContentTemplatesMenu,
    },
    {
        title: resources.SETTINGS,
        name: 'settings',
        icon: 'settings',
        component: SettingsMenu,
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
    currentContent: IContent
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
        currentContent: getCurrentContent(state.sensenet),
        activeItem: getActiveMenuItem(state.dms.menu),
    }
}

export default (connect(mapStateToProps, {
    chooseMenuItem: DMSActions.chooseMenuItem,
    chooseSubmenuItem: DMSActions.chooseSubmenuItem,
})(withStyles(styles)(DashboardDrawer)))
