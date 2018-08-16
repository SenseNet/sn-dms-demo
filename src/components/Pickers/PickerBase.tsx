import { Button, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemIcon, ListItemText, MuiThemeProvider, Popover } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import BackIcon from '@material-ui/icons/ArrowBack'
import CloseIcon from '@material-ui/icons/Close'
import NewFolderIcon from '@material-ui/icons/CreateNewFolder'
import FolderIcon from '@material-ui/icons/Folder'
import * as React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import { pickerTheme } from '../../assets/picker'
import { resources } from '../../assets/resources'

const mapStateToProps = (state: rootStateType) => {
    return {
        open: state.dms.picker.isOpened,
        anchorElement: state.dms.actionmenu.anchorElement,
        onClose: state.dms.picker.onClose,
        title: state.dms.picker.title,
    }
}

class Picker extends React.Component<ReturnType<typeof mapStateToProps>, {}> {
    public handleClose = () => {
        this.props.onClose()
    }
    public handleSubmit = () => {
        // Todo
    }
    public render() {
        const { open, anchorElement, title } = this.props
        return (
            <MuiThemeProvider theme={pickerTheme}>
                <Popover
                    open={open}
                    onClose={this.handleClose}
                    anchorEl={anchorElement}>
                    <DialogTitle>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose}>
                                <BackIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit">
                                {title}
                        </Typography>
                            <IconButton color="inherit" onClick={this.handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </DialogTitle>
                    <DialogContent>
                        <Scrollbars
                            style={{ height: 240, width: 'calc(100% - 1px)' }}
                            renderThumbVertical={({ style }) => <div style={{ ...style, borderRadius: 2, backgroundColor: '#999', width: 10, marginLeft: -2 }}></div>}
                            thumbMinSize={180}>
                            <List>
                                <ListItem button>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Best Practice-ek" />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Personák" />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Protorípus user teszt" />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="UI" />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="User interjúk" />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="User teszt" />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Wireframe skiccek" />
                                </ListItem>
                            </List>
                        </Scrollbars>
                    </DialogContent>
                    <DialogActions>
                        <IconButton>
                            <NewFolderIcon />
                        </IconButton>
                        <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleClose()}>{resources.CANCEL}</Button>
                        <Button onClick={() => this.handleSubmit()} variant="raised" color="primary">{resources.MOVE_HERE}</Button>
                    </DialogActions>
                </Popover>
            </MuiThemeProvider>
        )
    }
}

export default connect(mapStateToProps, {})(Picker)
