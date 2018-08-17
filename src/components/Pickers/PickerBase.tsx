import { Button, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemIcon, ListItemText, MuiThemeProvider, Popover } from '@material-ui/core'
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
        parent: state.dms.picker.parent,
        items: state.dms.picker.items,
        selected: state.dms.documentLibrary.selected,
        selectedTarget: state.dms.picker.selected,
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
        const { open, anchorElement, parent, selectedTarget, items } = this.props
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
                                {parent ? parent.DisplayName : 'Move content'}
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
                                {items.map((item) => {
                                    return <ListItem button>
                                        <ListItemIcon>
                                            <FolderIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={item.DisplayName} />
                                    </ListItem>
                                },
                                )}
                            </List>
                        </Scrollbars>
                    </DialogContent>
                    <DialogActions>
                        <IconButton>
                            <NewFolderIcon />
                        </IconButton>
                        <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleClose()}>{resources.CANCEL}</Button>
                        <Button onClick={() => this.handleSubmit()} variant="raised" disabled={selectedTarget.length > 0 ? false : true} color="primary">{resources.MOVE_HERE}</Button>
                    </DialogActions>
                </Popover>
            </MuiThemeProvider>
        )
    }
}

export default connect(mapStateToProps, {})(Picker)
