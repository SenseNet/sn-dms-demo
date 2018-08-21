import { Button, DialogActions, DialogContent, DialogTitle, List, ListItemIcon, ListItemText, MenuItem, MuiThemeProvider, Popover } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import BackIcon from '@material-ui/icons/ArrowBack'
import CloseIcon from '@material-ui/icons/Close'
import NewFolderIcon from '@material-ui/icons/CreateNewFolder'
import FolderIcon from '@material-ui/icons/Folder'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import { pickerTheme } from '../../assets/picker'
import { resources } from '../../assets/resources'
import { selectPickerItem } from '../../store/picker/Actions'

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

const mapDispatchToProps = {
    selectPickerItem,
}

const styles = {
    selected: {
        background: '#016d9e',
        color: '#fff',
    },
    iconsSelected: {
        color: '#fff',
    },
    textSelected: {
        color: '#fff !important',
    },
}

class Picker extends React.Component<{ classes?} & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleClose = () => {
        this.props.onClose()
    }
    public handleSubmit = () => {
        // Todo
    }
    public handleClick = (content: GenericContent) => {
        this.props.selectPickerItem(content)
    }
    public isSelected = (id: number) => {
        return this.props.selectedTarget.findIndex((item) => item.Id === id) > -1
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
                                    return <MenuItem button
                                        key={item.Id}
                                        style={this.isSelected(item.Id) ? styles.selected : null}
                                        onClick={() => this.handleClick(item)}
                                        selected={this.isSelected(item.Id)}>
                                        <ListItemIcon style={this.isSelected(item.Id) ? styles.iconsSelected : null}>
                                            <FolderIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                className={this.isSelected(item.Id) ? 'picker-item-selected' : 'picker-item'}>
                                                    {item.DisplayName}
                                                </Typography>} />
                                    </MenuItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(Picker)
