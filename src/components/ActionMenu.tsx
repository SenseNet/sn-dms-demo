import * as React from 'react'
import { connect } from 'react-redux'
import { Reducers } from 'sn-redux'
import { DMSActions } from '../Actions'
import { DMSReducers } from '../Reducers'
import Menu, { MenuItem } from 'material-ui/Menu';
import Icon from 'material-ui/Icon';

import { icons } from '../assets/icons'

const styles = {
    actionMenuItem: {
        lineHeight: '26px'
    },
    actionIcon: {
        fontSize: 20,
        verticalAlign: 'middle',
        marginRight: 5
    },
    actionMenu: {
        display: 'none'
    },
    open: {
        display: 'block'
    }
}

interface IActionMenuProps {
    actions,
    isOpen,
    anchorElement
}

class ActionMenu extends React.Component<IActionMenuProps, {}>{
    constructor(props) {
        super(props)
    }
    render() {
        const { isOpen, anchorElement, actions } = this.props
        return (
            <div>
                <ul
                    id='actionMenu'
                    style={
                        isOpen ? styles.open : styles.actionMenu
                    }
                >
                    {this.props.actions.map(action => {
                        return (
                            <li
                                key={action.Name}
                                style={styles.actionMenuItem}>
                                <Icon color='accent' style={styles.actionIcon}>{
                                    action.Icon === 'Application' ?
                                        icons[action.Name.toLowerCase()] :
                                        icons[action.Icon]
                                }</Icon>
                                {action.DisplayName}
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        actions: DMSReducers.getActions(state.actionmenu),
        isOpen: DMSReducers.actionmenuIsOpen(state.actionmenu),
        anchorElement: DMSReducers.getActionMenuAnchor(state.actionmenu)
    }
}

export default connect(mapStateToProps, {
    open: DMSActions.OpenActionMenu,
    close: DMSActions.CloseActionMenu
})(ActionMenu)