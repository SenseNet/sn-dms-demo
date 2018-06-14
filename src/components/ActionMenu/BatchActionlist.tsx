import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import * as React from 'react'
import { connect } from 'react-redux'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Reducers } from '@sensenet/redux'
import * as DMSActions from '../../Actions'
import { icons } from '../../assets/icons'
import * as DMSReducers from '../../Reducers'
import ActionList from './ActionList'

const toolbarActions = [
    {
        Name: 'Download',
        DisplayName: 'Download',
        Icon: 'Download',
        Batch: false,
    },
    {
        Name: 'Share',
        DisplayName: 'Share',
        Icon: 'Share',
        Batch: false,
    },
    {
        Name: 'Delete',
        DisplayName: 'Delete',
        Icon: 'Delete',
        Batch: true,
    },
    {
        Name: 'Copy',
        DisplayName: 'Copy',
        Icon: 'Copy',
        Batch: true,
    },
    {
        Name: 'Move',
        DisplayName: 'Move',
        Icon: 'Move',
        Batch: true,
    },
]

const styles = {
    icon: {
        display: 'inline-block',
    },
    hidden: {
        display: 'none',
    },
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
        marginTop: 45,
        padding: 0,
    },
    menuItem: {
        padding: '6px 15px',
        fontSize: '0.9rem',
    },
    actionIcon: {
        color: '#016D9E',
        marginRight: 14,
    },
}

interface BatchActionlistProps {
    currentId: number,
    actions: any[],
    getActions,
    selected: number[]
}

const ITEM_HEIGHT = 48

class BatchActionlist extends React.Component<BatchActionlistProps, { options, anchorEl }> {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            anchorEl: null,
        }
    }
    public componentWillReceiveProps(nextProps) {
        const { actions, currentId, getActions } = this.props
        if (currentId !== nextProps.currentId && actions.length === 0) {
            getActions(currentId, 'DocLibToolbar', toolbarActions)
        }
        if (this.props.actions.length !== nextProps.actions.length) {
            const optionList = []
            nextProps.actions.map((action, index) => {
                if (index > 1) {
                    optionList.push(action)
                }
            })
            this.setState({
                options: optionList,
            })
        }
    }
    public isHidden = () => {
        return this.props.selected.length > 0 ? false : true
    }
    public handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    }

    public handleClose = () => {
        this.setState({ anchorEl: null })
    }
    public render() {
        const { actions } = this.props
        const { options, anchorEl } = this.state
        return (
            <ul style={this.isHidden() ? { display: 'none', margin: 0 } : { display: 'block', margin: 0 }}>
                {actions.map((action, index) => {
                    return (index < 2) ?
                        <li key={action.Name} style={styles.icon} aria-label={action.DisplayName}>
                            <IconButton aria-label={action.DisplayName} disableRipple={true}>
                                <Icon color="primary" style={styles.icon} >{icons[action.Icon.toLowerCase()]}</Icon>
                            </IconButton>
                        </li>
                        : null
                })}
                <li key="More" style={styles.icon}><IconButton
                    aria-label="More"
                    aria-owns={anchorEl ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MoreVertIcon color="primary" />
                </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                        style={styles.menu}
                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option.Name}
                                onClick={(event) => this.handleClick}
                                style={styles.menuItem}>
                                <ListItemIcon style={styles.actionIcon}>
                                    <Icon color="primary">{
                                        option.Icon === 'Application' ?
                                            icons[option.Name.toLowerCase()] :
                                            icons[option.Icon.toLowerCase()]
                                    }</Icon>
                                </ListItemIcon>
                                {option.DisplayName}
                            </MenuItem>
                        ))}
                        ))}
                    </Menu>
                </li>
            </ul>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        actions: DMSReducers.getToolbarActions(state.dms.toolbar),
        currentId: DMSReducers.getCurrentId(state.dms),
        selected: Reducers.getSelectedContentIds(state.sensenet),
    }
}

export default connect(mapStateToProps, {
    getActions: DMSActions.loadListActions,
})(BatchActionlist)
