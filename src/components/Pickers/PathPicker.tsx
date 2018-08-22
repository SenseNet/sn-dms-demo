import { Button, DialogActions, DialogContent, List, ListItemIcon, ListItemText, MenuItem, Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import NewFolderIcon from '@material-ui/icons/CreateNewFolder'
import FolderIcon from '@material-ui/icons/Folder'
import OpenIcon from '@material-ui/icons/KeyboardArrowRight'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import { openDialog } from '../../Actions'
import { resources } from '../../assets/resources'
import { loadPickerItems, loadPickerParent, selectPickerItem, setBackLink } from '../../store/picker/Actions'

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
    openIcon: {
        display: 'block',
        color: '#fff',
    },
}

interface PathPickerProps {
    dialogComponent,
    dialogTitle: string,
    dialogCallback,
    mode: string,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        selectedTarget: state.dms.picker.selected,
        items: state.dms.picker.items,
        onClose: state.dms.picker.onClose,
    }
}

const mapDispatchToProps = {
    selectPickerItem,
    loadPickerParent,
    loadPickerItems,
    openDialog,
    setBackLink,
}

interface PathPickerState {
    hovered: number,
}

class PathPicker extends React.Component<PathPickerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, PathPickerState> {
    public state = {
        hovered: null,
    }
    public handleClose = () => {
        this.props.onClose()
    }
    public handleSubmit = () => {
        const { dialogComponent, dialogTitle, dialogCallback, onClose } = this.props
        this.props.openDialog(dialogComponent, dialogTitle, onClose, dialogCallback)
    }
    public isSelected = (id: number) => {
        return this.props.selectedTarget.findIndex((item) => item.Id === id) > -1
    }
    public handleClick = (e, content: GenericContent) => {
        // tslint:disable-next-line:no-string-literal
        e.currentTarget.attributes.getNamedItem('role') && e.currentTarget.attributes.getNamedItem('role').value === 'menuitem' ?
            this.props.selectPickerItem(content) :
            this.handleLoading(content.Id)
    }
    public handleMouseOver = (id: number) => {
        this.setState({
            hovered: id,
        })
    }
    public handleMouseOut = () => {
        this.setState({
            hovered: null,
        })
    }
    public isHovered = (id: number) => {
        return this.state.hovered === id
    }
    public hasChildren = (id: number) => {
        const content = this.props.items.find((item) => item.Id === id)
        // tslint:disable-next-line:no-string-literal
        return content['Children'] ? content['Children'].filter((child) => child.IsFolder).length > 0 ? true : false : false
    }
    public handleLoading = (id: number) => {
        const content = this.props.items.find((item) => item.Id === id)
        this.props.loadPickerParent(id)
        this.props.loadPickerItems(content.Path, content)
        this.props.setBackLink(true)
    }
    public render() {
        const { items, selectedTarget } = this.props
        return (
            <div>
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
                                    onClick={(e) => this.handleClick(e, item)}
                                    onMouseEnter={() => this.handleMouseOver(item.Id)}
                                    onMouseLeave={() => this.handleMouseOut()}
                                    selected={this.isSelected(item.Id)}>
                                    <ListItemIcon style={this.isSelected(item.Id) ? styles.iconsSelected : null}>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                className={this.isSelected(item.Id) ? 'picker-item-selected' : this.isHovered(item.Id) ? 'picker-item-hovered' : 'picker-item'}>
                                                {item.DisplayName}
                                            </Typography>} />
                                    {this.hasChildren(item.Id) ? <OpenIcon
                                        style={this.isHovered ? styles.openIcon : { display: 'none' }}
                                        onClick={(e) => this.handleClick(e, item)} /> :
                                        null
                                    }
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
                    <Button onClick={() => this.handleSubmit()} variant="raised" disabled={selectedTarget.length > 0 ? false : true} color="primary">{resources[`${this.props.mode.toUpperCase()}_BUTTON`]}</Button>
                </DialogActions>
            </div>
        )
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(PathPicker))
