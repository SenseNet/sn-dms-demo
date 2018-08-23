import Icon from '@material-ui/core/Icon'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { Forward, ModeEdit, Warning } from '@material-ui/icons'
import { pollDocumentData } from '@sensenet/document-viewer-react'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import { select } from '../../store/documentlibrary/actions'
import { closePicker, loadPickerItems, openPicker, setPickerParent } from '../../store/picker/actions'
import EditPropertiesDialog from '../Dialogs/EditPropertiesDialog'

import Fade from '@material-ui/core/Fade'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { IActionModel } from '@sensenet/default-content-types'
import { rootStateType } from '../..'
import { downloadFile } from '../../assets/helpers'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import ApproveorRejectDialog from '../Dialogs/ApproveorRejectDialog'
import CopyToConfirmDialog from '../Dialogs/CopyToConfirmDialog'
import DeleteDialog from '../Dialogs/DeleteDialog'
import MoveToConfirmDialog from '../Dialogs/MoveToConfirmDialog'
import VersionsDialog from '../Dialogs/VersionsDialog'
import PathPicker from '../Pickers/PathPicker'

const mapStateToProps = (state: rootStateType) => {
    return {
        actions: state.dms.actionmenu.actions,
        open: state.dms.actionmenu.open,
        anchorElement: state.dms.actionmenu.anchorElement,
        position: state.dms.actionmenu.position,
        hostName: state.sensenet.session.repository.repositoryUrl,
        currentitems: state.sensenet.currentitems,
        userName: state.sensenet.session.user.userName,
        queryOptions: state.sensenet.currentitems.options,
        currentContent: state.dms.actionmenu.content,
        currentParent: state.dms.documentLibrary.parent,
    }
}

const mapDispatchToProps = {
    setEdited: DMSActions.setEditedContentId,
    clearSelection: Actions.clearSelection,
    deleteBatch: Actions.deleteBatch,
    closeActionMenu: DMSActions.closeActionMenu,
    pollDocumentData,
    openViewer: DMSActions.openViewer,
    logout: Actions.userLogout,
    openDialog: DMSActions.openDialog,
    closeDialog: DMSActions.closeDialog,
    openPicker,
    closePicker,
    loadContent: Actions.loadContent,
    fetchContent: Actions.requestContent,
    checkoutContent: Actions.checkOut,
    checkinContent: Actions.checkIn,
    publishContent: Actions.publish,
    undoCheckout: Actions.undoCheckout,
    forceundoCheckout: Actions.forceUndoCheckout,
    setPickerParent,
    loadPickerItems,
    select,
}

const styles = {
    actionmenuContainer: {
        flex: 1,
    },
    menuIcon: {
        color: '#fff',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer',
    },
    menuIconMobile: {
        width: 'auto' as any,
        marginLeft: '16px',
    },
    arrowButton: {
        marginLeft: 0,
    },
    menuItem: {
        padding: '6px 15px',
        fontSize: '0.9rem',
        fontFamily: 'Raleway Medium',
    },
    avatar: {
        display: 'inline-block',
    },
    actionIcon: {
        color: '#016D9E',
        marginRight: 14,
    },
}

interface ActionMenuProps {
    id: number,
}

interface ActionMenuState {
    hovered: string,
    selectedIndex: number,
    anchorEl: HTMLElement | null
}

class ActionMenu extends React.Component<ActionMenuProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, ActionMenuState> {
    constructor(props: ActionMenu['props']) {
        super(props)
        this.state = {
            hovered: '',
            selectedIndex: 1,
            anchorEl: null,
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
    }
    public componentWillReceiveProps(nextProps: this['props']) {
        if (nextProps.open === false) {
            this.setState({
                anchorEl: null,
            })
        }
    }
    public isHovered(id: string) {
        return this.state.hovered === id
    }
    public handleMouseEnter(e: React.MouseEvent, name: string) {
        this.setState({
            hovered: name,
        })
    }
    public handleMouseLeave() {
        this.setState({
            hovered: '',
        })
    }
    public handleClose = () => {
        this.props.closeActionMenu()
        this.setState({ anchorEl: null })
    }
    public handleMenuItemClick(e: React.MouseEvent, action: IActionModel) {
        if ((action as any).Action) {
            (action as any).Action()
        } else {
            const content = this.props.currentContent
            switch (action.Name) {
                case 'Rename':
                    this.handleClose()
                    this.props.setEdited(this.props.currentContent.Id)
                    break
                case 'ClearSelection':
                    this.handleClose()
                    this.props.clearSelection()
                    break
                case 'DeleteBatch':
                case 'Delete':
                    this.handleClose()
                    this.props.clearSelection()
                    this.props.openDialog(
                        <DeleteDialog selected={[this.props.currentContent.Id]} />,
                        resources.DELETE, this.props.closeDialog)
                    break
                case 'Preview':
                    this.handleClose()
                    this.props.openViewer(this.props.currentContent.Id)
                    this.props.pollDocumentData(this.props.hostName, this.props.currentContent.Id)
                    break
                case 'Logout':
                    this.handleClose()
                    this.props.logout()
                    break
                case 'Browse':
                    this.handleClose()
                    const path = this.props.currentContent.Path
                    downloadFile(path, this.props.hostName)
                    break
                case 'Versions':
                    this.handleClose()
                    this.props.openDialog(
                        <VersionsDialog currentContent={this.props.currentContent} />,
                        resources.VERSIONS, this.props.closeDialog)
                    break
                case 'Profile':
                    this.handleClose()
                    const doclibPath = `/Root/Profiles/Public/${this.props.userName}/Document_Library`
                    this.props.loadContent(doclibPath)
                    this.props.fetchContent(doclibPath, this.props.queryOptions)
                    break
                case 'Edit':
                    this.handleClose()
                    this.props.openDialog(
                        <EditPropertiesDialog
                            content={content}
                            contentTypeName={content.Type} />,
                        resources.EDIT_PROPERTIES, this.props.closeDialog)
                    break
                case 'CheckOut':
                    this.handleClose()
                    this.props.checkoutContent(content.Id)
                    break
                case 'Publish':
                    this.handleClose()
                    this.props.publishContent(content.Id)
                    break
                case 'CheckIn':
                    this.handleClose()
                    this.props.checkinContent(content.Id)
                    break
                case 'UndoCheckOut':
                    this.handleClose()
                    this.props.undoCheckout(content.Id)
                    break
                case 'ForceUndoCheckOut':
                    this.handleClose()
                    this.props.forceundoCheckout(content.Id)
                    break
                case 'Approve':
                    this.handleClose()
                    this.props.openDialog(
                        <ApproveorRejectDialog
                            id={content.Id}
                            fileName={content.DisplayName} />,
                        resources.APPROVE_OR_REJECT, this.props.closeDialog)
                    break
                case 'MoveTo':
                    this.handleClose()
                    this.props.select([content])
                    this.props.setPickerParent(this.props.currentParent)
                    this.props.loadPickerItems(this.props.currentParent.Path, content)
                    this.props.openPicker(
                        <PathPicker
                            mode="MoveTo"
                            dialogComponent={<MoveToConfirmDialog />}
                            dialogTitle={resources.MOVE}
                            dialogCallback={Actions.moveBatch} />,
                        this.props.closePicker)
                    break
                case 'CopyTo':
                    this.handleClose()
                    this.props.select([content])
                    this.props.setPickerParent(this.props.currentParent)
                    this.props.loadPickerItems(this.props.currentParent.Path, content)
                    this.props.openPicker(
                        <PathPicker
                            mode="CopyTo"
                            dialogComponent={<CopyToConfirmDialog />}
                            dialogTitle={resources.COPY}
                            dialogCallback={Actions.copyBatch} />,
                        this.props.closePicker)
                    break
                case 'MoveBatch':
                    this.handleClose()
                    this.props.setPickerParent(this.props.currentParent)
                    this.props.loadPickerItems(this.props.currentParent.Path, content)
                    this.props.openPicker(
                        <PathPicker
                            mode="MoveTo"
                            dialogComponent={<MoveToConfirmDialog />}
                            dialogTitle={resources.MOVE}
                            dialogCallback={Actions.moveBatch} />,
                        this.props.closePicker)
                    break
                default:
                    console.log(`${action.Name} is clicked`)
                    this.handleClose()
                    break
            }
        }
    }
    public render() {
        const { actions, open, position } = this.props
        return <Menu
            id="actionmenu"
            open={open}
            onClose={this.handleClose}
            anchorReference="anchorPosition"
            anchorPosition={position}
            TransitionComponent={Fade}
        >
            {
                actions.map((action, index) => {
                    return <MenuItem
                        key={index}
                        onClick={(event) => this.handleMenuItemClick(event, action)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#016d9e'
                            e.currentTarget.style.fontWeight = 'bold'
                        }
                        }
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#000'
                            e.currentTarget.style.fontWeight = 'normal'
                        }}
                        style={styles.menuItem}
                        title={action.DisplayName}>
                        <ListItemIcon style={styles.actionIcon}>
                            <Icon color="primary">{
                                action.Icon === 'Application' ?
                                    icons[action.Name.toLowerCase() as keyof typeof icons] :
                                    icons[action.Icon.toLowerCase() as keyof typeof icons]
                            }
                                {
                                    action.Name === 'MoveTo' ? <Forward style={{ position: 'absolute', left: '0.87em', top: '0.3em', width: '0.5em', color: 'white' }} /> : null
                                }
                                {
                                    action.Name === 'Rename' ? <ModeEdit style={{ position: 'absolute', left: '0.87em', top: '0.38em', width: '0.5em', color: 'white' }} /> : null
                                }
                                {
                                    action.Name === 'ForceUndoCheckOut' ? <Warning style={{ position: 'absolute', left: '0.87em', top: '0.38em', width: '0.5em', color: 'white' }} /> : null
                                }
                            </Icon>
                        </ListItemIcon>
                        {action.DisplayName}
                    </MenuItem>
                })
            }
        </Menu >
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionMenu)
