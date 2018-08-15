import Icon from '@material-ui/core/Icon'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { Forward, ModeEdit } from '@material-ui/icons'
import { pollDocumentData } from '@sensenet/document-viewer-react'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import EditPropertiesDialog from '../Dialogs/EditPropertiesDialog'

import Fade from '@material-ui/core/Fade'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { rootStateType } from '../..'
import { downloadFile } from '../../assets/helpers'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import DeleteDialog from '../Dialogs/DeleteDialog'
import VersionsDialog from '../Dialogs/VersionsDialog'

const mapStateToProps = (state: rootStateType) => {
    return {
        actions: state.dms.actionmenu.actions,
        contentId: state.dms.actionmenu.id,
        currentContent: Reducers.getCurrentContent(state.sensenet),
        selected: Reducers.getSelectedContentIds(state.sensenet),
        open: state.dms.actionmenu.open,
        anchorElement: state.dms.actionmenu.anchorElement,
        position: state.dms.actionmenu.position,
        hostName: state.sensenet.session.repository.repositoryUrl,
        currentitems: state.sensenet.currentitems,
        userName: state.sensenet.session.user.userName,
        queryOptions: state.sensenet.currentitems.options,
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
    loadContent: Actions.loadContent,
    fetchContent: Actions.requestContent,
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
    public handleMenuItemClick(e: React.MouseEvent, action: any) {
        if (action.Action) {
            action.Action()
        } else {
            switch (action.Name) {
                case 'Rename':
                    this.handleClose()
                    this.props.setEdited(this.props.id)
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
                        <DeleteDialog selected={[this.props.contentId]} />,
                        resources.DELETE, this.props.closeDialog)
                    break
                case 'Preview':
                    this.handleClose()
                    this.props.openViewer(this.props.contentId)
                    this.props.pollDocumentData(this.props.hostName, this.props.contentId)
                    break
                case 'Logout':
                    this.handleClose()
                    this.props.logout()
                    break
                case 'Browse':
                    this.handleClose()
                    const currentId = this.props.contentId
                    const path = this.props.currentitems.entities.find((item) => item.Id === currentId).Path
                    downloadFile(path, this.props.hostName)
                    break
                case 'Versions':
                    this.handleClose()
                    this.props.openDialog(
                        <VersionsDialog id={this.props.contentId} />,
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
                    const content = this.props.currentitems.entities.find((item) => item.Id === this.props.contentId)
                    this.props.openDialog(
                        <EditPropertiesDialog
                            content={content}
                            contentTypeName={content.Type} />,
                        resources.EDIT_PROPERTIES, this.props.closeDialog)
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
