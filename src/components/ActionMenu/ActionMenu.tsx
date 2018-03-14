import Dialog, { DialogTitle } from 'material-ui/Dialog'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import * as DMSReducers from '../../Reducers'
import ActionList from './ActionList'

const styles = {
    actionMenu: {
        display: 'none',
    },
    open: {
        display: 'block',
        position: 'absolute',
        zIndex: 10,
        maxHeight: 'calc(100vh - 96px)',
        WebkitOverflowScrolling: 'touch',
        minWidth: 16,
        minHeight: 16,
        transform: 'scale(1, 1)',
        transformOrigin: '0px 32px 0px',
        transition: 'opacity 267ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 178ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        background: '#fff',
        boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
        borderRadius: 2,
    },
}

interface ActionMenuProps {
    actions,
    id,
    title,
    isOpen,
    position,
    currentContent,
    close
}

interface ActionMenuState {
    mouseIsDownOnMenu
}

class ActionMenu extends React.Component<ActionMenuProps, ActionMenuState> {
    constructor(props) {
        super(props)

        this.state = {
            mouseIsDownOnMenu: false,
        }

        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleActionMenuClose = this.handleActionMenuClose.bind(this)
        this.handleOutsideClick = this.handleOutsideClick.bind(this)
    }
    public componentDidMount() {
        window.addEventListener('mousedown', this.handleOutsideClick, false)
    }
    public handleActionMenuClose() {
        this.props.close()
    }
    public handleMouseDown(e) {
        this.setState({
            mouseIsDownOnMenu: true,
        })
    }
    public handleMouseUp(e) {
        this.setState({
            mouseIsDownOnMenu: false,
        })
    }
    public handleOutsideClick(e) {
        if (this.state.mouseIsDownOnMenu) {
            return
        }
        if (this.props.isOpen) {
            this.handleActionMenuClose()
        }
    }
    public render() {
        const { isOpen, position } = this.props
        const positionStyles = {
            positions: {
                top: position ? `${position.top}px` : 0,
                left: position ? `${position.left}px` : 0,
            },
        }
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return matches ?
                        <div style={isOpen ? { ...styles.open, ...positionStyles.positions as any } : styles.actionMenu}>
                            <ActionList handleActionMenuClose={this.handleActionMenuClose} id={this.props.id} handleMouseUp={this.handleMouseUp} handleMouseDown={this.handleMouseDown} />
                        </div> :
                        <Dialog onClose={this.handleActionMenuClose} open={isOpen}>
                            <DialogTitle>{this.props.title}</DialogTitle>
                            <ActionList handleActionMenuClose={this.handleActionMenuClose} id={this.props.id} handleMouseUp={this.handleMouseUp} handleMouseDown={this.handleMouseDown} />
                        </Dialog>
                }}
            </MediaQuery>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        isOpen: DMSReducers.actionmenuIsOpen(state.dms.actionmenu),
        position: DMSReducers.getActionMenuPosition(state.dms.actionmenu),
        id: DMSReducers.getItemOnActionMenuIsOpen(state.dms.actionmenu),
        title: DMSReducers.getItemTitleOnActionMenuIsOpen(state.dms.actionmenu),
    }
}

export default connect(mapStateToProps, {
    close: DMSActions.closeActionMenu,
})(ActionMenu)
