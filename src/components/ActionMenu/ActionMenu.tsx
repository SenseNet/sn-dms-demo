import Icon from '@material-ui/core/Icon'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { Forward, ModeEdit } from '@material-ui/icons'
import { pollDocumentData } from '@sensenet/document-viewer-react'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import * as DMSReducers from '../../Reducers'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { rootStateType } from '../..'
import { icons } from '../../assets/icons'

const mapStateToProps = (state: rootStateType) => {
    return {
        actions: DMSReducers.getActions(state.dms.actionmenu),
        contentId: state.dms.actionmenu.id,
        currentContent: Reducers.getCurrentContent(state.sensenet),
        selected: Reducers.getSelectedContentIds(state.sensenet),
        open: DMSReducers.actionmenuIsOpen(state.dms.actionmenu),
        anchorElement: DMSReducers.getAnchorElement(state.dms.actionmenu),
        position: DMSReducers.getMenuPosition(state.dms.actionmenu),
        hostName: state.sensenet.session.repository.hostName,
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
    public handleMenuItemClick(e: React.MouseEvent, action: string) {
        switch (action) {
            case 'Rename':
                this.handleClose()
                this.props.setEdited(this.props.id)
                break
            case 'ClearSelection':
                this.handleClose()
                this.props.clearSelection()
                break
            case 'DeleteBatch':
                this.handleClose()
                this.props.clearSelection()
                this.props.deleteBatch(this.props.selected, false)
                break
            case 'Preview':
                this.handleClose()
                if (this.props.contentId) {
                    this.props.openViewer(this.props.contentId)
                    this.props.pollDocumentData(this.props.hostName, this.props.contentId)
                }
            case 'Logout':
                this.handleClose()
                this.props.logout()
            default:
                console.log(`${action} is clicked`)
                this.handleClose()
                break
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
        >
            {
                actions.map((action, index) => {
                    return <MenuItem
                        key={action.Name}
                        onClick={(event) => this.handleMenuItemClick(event, action.Name)}
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
