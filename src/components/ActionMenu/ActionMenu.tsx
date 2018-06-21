import { withStyles } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { Forward, ModeEdit } from '@material-ui/icons'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import * as DMSReducers from '../../Reducers'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { icons } from '../../assets/icons'

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
    menu: {
        padding: 0,
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
    actions,
    id,
    open,
    selected,
    currentContent,
    setEdited,
    handleMouseDown,
    handleMouseUp,
    clearSelection,
    deleteBatch,
    uploadContent,
    anchorElement,
    closeActionMenu,
    position,
}

interface ActionMenuState {
    hovered,
    selectedIndex,
    anchorEl
}

class ActionMenu extends React.Component<ActionMenuProps, ActionMenuState> {
    constructor(props) {
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
    public componentWillReceiveProps(nextProps) {
        if (nextProps.open === false) {
            this.setState({
                anchorEl: null,
            })
        }
    }
    public isHovered(id) {
        return this.state.hovered === id
    }
    public handleMouseEnter(e, name) {
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
    public handleMenuItemClick(e, action) {
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
            default:
                console.log(`${action} is clicked`)
                this.handleClose()
                break
        }
    }
    public render() {
        const { actions, open, anchorElement, position } = this.props
        return <Menu
            id="actionmenu"
            open={open}
            style={styles.menu}
            onClose={this.handleClose}
            anchorReference="anchorPosition"
            anchorPosition={position}
        >
            {
                actions.map((action, index) => {
                    return <MenuItem
                        key={action.Name}
                        selected={index === this.state.selectedIndex}
                        onClick={(event) => this.handleMenuItemClick(event, index)}
                        style={styles.menuItem}
                        title={action.DisplayName}>
                        <ListItemIcon style={styles.actionIcon}>
                            <Icon color="primary">{
                                action.Icon === 'Application' ?
                                    icons[action.Name.toLowerCase()] :
                                    icons[action.Icon.toLowerCase()]
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

const mapStateToProps = (state, match) => {
    return {
        actions: DMSReducers.getActions(state.dms.actionmenu),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        selected: Reducers.getSelectedContentIds(state.sensenet),
        open: DMSReducers.actionmenuIsOpen(state.dms.actionmenu),
        anchorElement: DMSReducers.getAnchorElement(state.dms.actionmenu),
        position: DMSReducers.getMenuPosition(state.dms.actionmenu),
    }
}

export default connect(mapStateToProps, {
    setEdited: DMSActions.setEditedContentId,
    clearSelection: Actions.clearSelection,
    deleteBatch: Actions.deleteBatch,
    closeActionMenu: DMSActions.closeActionMenu,
})(ActionMenu)
