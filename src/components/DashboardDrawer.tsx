import { Divider, Drawer, MenuList, StyleRulesCallback, withStyles } from '@material-ui/core'
import { IContent, IUploadProgressInfo } from '@sensenet/client-core'
import { getCurrentContent } from '@sensenet/redux/dist/Reducers'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../Actions'
import { getActiveMenuItem } from '../Reducers'
import ContentTypesMenu from './Menu/ContentTypesMenu'
import DocumentsMenu from './Menu/DocumentsMenu'
import GroupsMenu from './Menu/GroupsMenu'
import UsersMenu from './Menu/UsersMenu'

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
                <DocumentsMenu active={activeItem === 'documents'} chooseMenuItem={chooseMenuItem} chooseSubmenuItem={chooseSubmenuItem}  />
                <Divider light />
                <UsersMenu active={activeItem === 'users'} chooseMenuItem={chooseMenuItem} chooseSubmenuItem={chooseSubmenuItem} />
                <Divider light />
                <GroupsMenu active={activeItem === 'groups'} chooseMenuItem={chooseMenuItem} chooseSubmenuItem={chooseSubmenuItem} />
                <Divider light />
                <ContentTypesMenu active={activeItem === 'contenttypes'} chooseMenuItem={chooseMenuItem} chooseSubmenuItem={chooseSubmenuItem} />
                <Divider light />
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
