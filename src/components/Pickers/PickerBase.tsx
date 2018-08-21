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
import { loadPickerItems, loadPickerParent, selectPickerItem, setPickerParent } from '../../store/picker/Actions'

// tslint:disable-next-line:no-var-requires
const sensenetLogo = require('../../assets/sensenet_white.png')

const mapStateToProps = (state: rootStateType) => {
    return {
        open: state.dms.picker.isOpened,
        anchorElement: state.dms.actionmenu.anchorElement,
        onClose: state.dms.picker.onClose,
        parent: state.dms.picker.parent,
        items: state.dms.picker.items,
        selected: state.dms.documentLibrary.selected,
        selectedTarget: state.dms.picker.selected,
        closestWs: state.dms.picker.closestWorkspace,
    }
}

const mapDispatchToProps = {
    selectPickerItem,
    loadPickerParent,
    loadPickerItems,
    setPickerParent,
}

interface PickerState {
    hovered: number,
    backLink: boolean,
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
    snButton: {
        flex: '0 0 auto',
        width: 48,
        height: 48,
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        justifyContent: 'center',
    },
    snLogo: {
        width: '1em',
        height: '1em',
        display: 'inline-block',
        flexShrink: 0,
    },
}

class Picker extends React.Component<{ classes?} & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, PickerState> {
    public state = {
        hovered: null,
        backLink: true,
    }
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
    public isLastItem = () => {
        const { parent, closestWs } = this.props
        const contentName = parent.Name
        return parent.Path.substr(0, parent.Path.length - (contentName.length + 1)) === closestWs
    }
    public handleClickBack = () => {
        const { parent } = this.props
        if (this.isLastItem) {
            this.setState({
                backLink: false,
            })
            const snContent = {
                DisplayName: 'sensenet',
                Workspace: {
                    Path: null,
                },
            } as GenericContent
            this.props.setPickerParent(snContent)
            this.props.loadPickerItems('/', snContent,
                {
                    query: 'TypeIs:Workspace -TypeIs:Site',
                    select: ['DisplayName', 'Id', 'Path'],
                    orderby: [['DisplayName', 'asc']],
                })
        } else {
            this.props.loadPickerParent(parent.ParentId)
            this.props.loadPickerItems(parent.Path, { Id: parent.ParentId } as GenericContent)
        }
    }
    public isHovered = (id: number) => {
        return this.state.hovered === id
    }
    public render() {
        const { open, anchorElement, parent, selectedTarget, items } = this.props
        const { backLink } = this.state
        return (
            <MuiThemeProvider theme={pickerTheme}>
                <Popover
                    open={open}
                    onClose={this.handleClose}
                    anchorEl={anchorElement}>
                    <DialogTitle>
                        <Toolbar>
                            {backLink ?
                                <IconButton color="inherit" onClick={() => this.handleClickBack()}>
                                    <BackIcon />
                                </IconButton> :
                                <div style={styles.snButton}>
                                    <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={styles.snLogo} />
                                </div>}
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
