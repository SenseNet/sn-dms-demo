import { withStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { IContent, IUploadProgressInfo } from '@sensenet/client-core'
import { getCurrentContent } from '@sensenet/redux/dist/Reducers'
import * as React from 'react'
import { connect } from 'react-redux'
import { uploadFileList } from '../Actions'
import { UploadBar } from './Upload/UploadBar'
import { UploadButton } from './Upload/UploadButton'

const drawerWidth = 240

const styles = (theme) => ({
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
                style={{width: '100%'}}
                multiple={true}
                handleUpload={(fileList) => this.props.uploadFileList({
                    fileList,
                    createFolders: true,
                    contentTypeName: 'File',
                    binaryPropertyName: 'Binary',
                    overwrite: false,
                    parentPath: this.props.currentContent.Path,
            })} />
            <UploadBar items={this.props.uploadItems} isOpened={true}/>

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
        uploadItems: state.dms.uploads.items,
        showUploads: state.dms.uploads.showProgress,
    }
}

export default withStyles(styles as any)(connect(mapStateToProps, {
    uploadFileList,
})(DashboardDrawer))
