import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import * as React from 'react'
import { connect } from 'react-redux'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import { IActionModel } from '@sensenet/default-content-types'
import { Reducers } from '@sensenet/redux'
import { rootStateType } from '../..'
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

const mapStateToProps = (state: rootStateType) => {
    return {
        actions: state.dms.toolbar.actions,
        currentId: DMSReducers.getCurrentId(state.dms),
        selected: Reducers.getSelectedContentIds(state.sensenet),
        currentContent: Reducers.getCurrentContent(state.sensenet),
    }
}

const mapDispatchToProps = {
    getActions: DMSActions.loadListActions,
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
}

export interface BatchActionlistState {
    options: IActionModel[],
    anchorEl,
    actions,
}

class BatchActionlist extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, BatchActionlistState> {
    public state = {
        options: [],
        anchorEl: null,
        actions: [],
        currentId: null,
    }
    constructor(props: BatchActionlist['props']) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    public static getDerivedStateFromProps(newProps: BatchActionlist['props'], lastState: BatchActionlist['state']) {
        if ((newProps.currentContent && newProps.currentContent.Id && lastState.currentId !== newProps.currentContent.Id && lastState.actions.length === 0)) {
            newProps.getActions(newProps.currentContent.Id, 'DMSBatchActions', [{
                Name: 'Download', DisplayName: 'Download', Icon: 'download', Index: 1,

            } as IActionModel])
        }
        const optionList = []
        if (lastState.actions.length !== newProps.actions.length) {
            newProps.actions.map((action, index) => {
                if (index > 1) {
                    optionList.push(action)
                }
            })
        }
        return {
            ...lastState,
            currentId: newProps.currentContent && newProps.currentContent.Id || null,
            options: optionList,
        }
    }
    public isHidden = () => {
        return this.props.selected.length > 0 ? false : true
    }
    public handleClick = (e) => {
        const { currentContent } = this.props
        const { options } = this.state
        this.props.closeActionMenu()
        this.props.openActionMenu(options, currentContent.Id, currentContent.Id.toString(), e.currentTarget, {
            top: e.currentTarget.offsetTop + 100,
            left: e.currentTarget.offsetLeft + 100,
        })
    }

    public handleClose = () => {
        this.setState({ anchorEl: null })
    }
    public render() {
        const { actions } = this.props
        if (!this.props.currentContent) {
            return null
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(BatchActionlist)
