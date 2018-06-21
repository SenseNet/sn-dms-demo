import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import * as React from 'react'
import { connect } from 'react-redux'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import { IActionModel } from '@sensenet/default-content-types'
import { Reducers } from '@sensenet/redux'
import * as DMSActions from '../../Actions'
import { icons } from '../../assets/icons'
import * as DMSReducers from '../../Reducers'

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
    selected: number[],
    openActionMenu,
    closeActionMenu,
}

const ITEM_HEIGHT = 48

class BatchActionlist extends React.Component<BatchActionlistProps, { options, anchorEl }> {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            anchorEl: null,
        }
        this.handleClick = this.handleClick.bind(this)
    }
    public componentWillReceiveProps(nextProps) {
        const { actions, currentId, getActions } = this.props
        if (currentId !== nextProps.currentId && actions.length === 0) {
            getActions(nextProps.currentId, 'DMSBatchActions', [{
                Name: 'Download', DisplayName: 'Download', Icon: 'download', Index: 1,

            } as IActionModel])
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
    public handleClick = (e) => {
        const { actions, currentId } = this.props
        this.props.closeActionMenu()
        // const ddActions = actions.splice(3)
        this.props.openActionMenu(actions, currentId, currentId, e.currentTarget, {
            top: e.currentTarget.offsetTop + 150,
            left: e.currentTarget.offsetLeft,
        })
    }

    public handleClose = () => {
        this.setState({ anchorEl: null })
    }
    public render() {
        const { actions } = this.props
        const { anchorEl } = this.state
        return (
            <ul style={this.isHidden() ? { display: 'none', margin: 0 } : { display: 'block', margin: 0 }}>
                {actions.map((action, index) => {
                    return (index < 3) ?
                        <li key={action.Name} style={styles.icon} aria-label={action.DisplayName} title={action.DisplayName}>
                            <IconButton aria-label={action.DisplayName} disableRipple={true}>
                                <Icon color="primary" style={styles.icon} >{icons[action.Icon.toLowerCase()]}</Icon>
                            </IconButton>
                        </li>
                        : null
                })}
                <li key="More" style={styles.icon}>
                    <IconButton
                        aria-label="More"
                        aria-owns="actionmenu"
                        aria-haspopup="true"
                        onClick={(e) => this.handleClick(e)}
                        style={{ position: 'relative' }}
                    >
                        <MoreVertIcon color="primary" />
                    </IconButton>
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
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
})(BatchActionlist)
