import { Divider, Drawer, Icon, List, ListItem, ListItemIcon, StyleRulesCallback, withStyles } from '@material-ui/core'
import { IContent, IUploadProgressInfo } from '@sensenet/client-core'
import { getCurrentContent } from '@sensenet/redux/dist/Reducers'
import * as React from 'react'
import { connect } from 'react-redux'
import { hideUploadItem, hideUploadProgress, removeUploadItem, uploadFileList } from '../Actions'
import { UploadBar } from './Upload/UploadBar'
import { UploadButton } from './Upload/UploadButton'

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

const drawerWidth = 205

const styles: StyleRulesCallback = () => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
})

interface DashboarDrawerProps {
    classes: {
        drawerPaper: string;
    }
    currentContent: IContent
    uploadFileList: typeof uploadFileList,
    uploadItems: IUploadProgressInfo[]
    showUploads: boolean
    hideUploadProgress: () => void,
    removeUploadItem: typeof removeUploadItem

}

class DashboardDrawer extends React.Component<DashboarDrawerProps, {}> {
    public render() {
        const { classes } = this.props
        return <Drawer
            variant="permanent"
            open={true}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div style={{ height: 48 }}></div>
            <UploadButton
                style={{
                    width: 'calc(100% - 2em)',
                    margin: '1em',
                    marginBottom: 0,
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

            <div style={{ padding: 10, fontSize: 14, color: '#666' }}>
                <List>
                    <li>
                        <Divider />
                    </li>
                    <ListItem style={{ padding: '20px 10px' }}>
                        <ListItemIcon>
                            <Icon color="primary">people</Icon>
                        </ListItemIcon>
                        Shared with me
        </ListItem>
                    <li>
                        <Divider />
                    </li>
                    <ListItem style={{ padding: '20px 10px' }}>
                        <ListItemIcon>
                            <Icon color="primary">star</Icon>
                        </ListItemIcon>
                        Saved searches
            </ListItem>
                    <li>
                        <Divider />
                    </li>
                    <ListItem style={{ padding: '20px 10px' }}>
                        <ListItemIcon>
                            <Icon color="primary">delete</Icon>
                        </ListItemIcon>
                        Trash
            </ListItem>
                    <li>
                        <Divider />
                    </li>
                </List>
            </div>
        </Drawer>
    }
}

const mapStateToProps = (state) => {
    return {
        currentContent: getCurrentContent(state.sensenet),
    }
}

export default (connect(mapStateToProps, {
    uploadFileList,
})(withStyles(styles)(DashboardDrawer)))
