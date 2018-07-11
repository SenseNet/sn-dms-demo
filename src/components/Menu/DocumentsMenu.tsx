import { Divider, Icon, ListItemText, MenuItem, MenuList, StyleRulesCallback, withStyles } from '@material-ui/core'
import { IContent, IUploadProgressInfo } from '@sensenet/client-core'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { hideUploadItem, hideUploadProgress, removeUploadItem, uploadFileList } from '../../Actions'
import * as DMSReducers from '../../Reducers'
import { UploadBar } from '../Upload/UploadBar'
import { UploadButton } from '../Upload/UploadButton'
import { AddNewButton } from './AddNewButton'

const styles: StyleRulesCallback = () => ({
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

interface DocumentMenuProps {
    active,
    subactive,
    classes,
    item,
    uploadFileList: typeof uploadFileList,
    currentContent: IContent,
    uploadItems: IUploadProgressInfo[]
    showUploads: boolean
    hideUploadProgress: () => void,
    removeUploadItem: typeof removeUploadItem,
    chooseMenuItem,
    chooseSubmenuItem,
}

const subMenu = [
    {
        title: 'Shared with me',
        name: 'shared',
        icon: 'group',
    },
    {
        title: 'Saved queries',
        name: 'savedqueries',
        icon: 'cached',
    },
    {
        title: 'Trash',
        icon: 'delete',
        name: 'trash',
    },
]

// tslint:disable-next-line:variable-name
const ConnectedUploadBar = connect((state) => {
    return {
        items: state.dms.uploads.uploads,
        isOpened: state.dms.uploads.showProgress,
    }
}, {
        close: hideUploadProgress,
        removeItem: hideUploadItem,
    })(UploadBar)

class DocumentsMenu extends React.Component<DocumentMenuProps, {}> {
    public handleMenuItemClick = (title) => {
        this.props.chooseMenuItem(title)
    }
    public handleSubmenuItemClick = (title) => {
        this.props.chooseSubmenuItem(title)
    }
    public render() {
        const { active, classes, subactive, item } = this.props
        return (
            <div>
                <MenuItem
                    selected={active}
                    classes={{ root: classes.root, selected: classes.selected }}
                    onClick={(e) => this.handleMenuItemClick('documents')}>
                    <Icon className={active ? classes.iconWhiteActive : classes.iconWhite} color="primary">
                        {item.icon}
                    </Icon>
                    <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} inset primary={item.title} />
                </MenuItem>
                <div className={active ? classes.open : classes.closed}>
                    <Divider />
                    <UploadButton
                        style={{
                            width: '100%',
                            margin: '10px 0 0 0',
                            fontFamily: 'Raleway Bold',
                            fontSize: '14px',
                        }}
                        multiple={true}
                        handleUpload={(fileList) => this.props.uploadFileList({
                            fileList,
                            createFolders: true,
                            contentTypeName: 'File',
                            binaryPropertyName: 'Binary',
                            overwrite: false,
                            parentPath: this.props.currentContent.Path,
                        })}
                    />
                    <ConnectedUploadBar />
                    <AddNewButton contentType="" />
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
        subactive: DMSReducers.getActiveSubmenuItem(state.dms.menu),
        currentContent: Reducers.getCurrentContent(state.sensenet),
    }
}

export default (connect(mapStateToProps, {
    uploadFileList,
})(withStyles(styles)(DocumentsMenu)))
