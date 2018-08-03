import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import {
    withRouter,
} from 'react-router-dom'
import * as DMSActions from '../Actions'

import { Actions, Reducers } from '@sensenet/redux'
import { icons } from '../assets/icons'

const styles = {
    breadCrumb: {
        flexGrow: 2,
    },
    breadCrumbItem: {
        fontFamily: 'Raleway SemiBold',
        textTransform: 'none',
        color: '#666',
        padding: 8,
        letterSpacing: '0.05rem',
        fontSize: 16,
    },
    breadCrumbIcon: {
        display: 'inline-block',
        color: '#777',
        verticalAlign: 'middle',
        margin: '0 -7px',
    },
    breadCrumbItemLast: {
        fontFamily: 'Raleway ExtraBold',
        fontSize: 16,
    },
    breadCrumbIconLast: {
        margin: 0,
    },
    breadCrumbIconLeft: {
    },
    item: {
        display: 'inline-block',
        margin: 0,
        padding: 0,
    },
}

interface BreadCrumbProps {
    actions,
    history,
    breadcrumb,
    openActionMenu,
    closeActionMenu,
    currentContent,
    getActions,
}

class BreadCrumb extends React.Component<BreadCrumbProps, {}> {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleActionMenuClick = this.handleActionMenuClick.bind(this)
    }
    public handleClick(e, id) {
        this.props.history.push(`/${id}`)
    }
    public componentDidUpdate(prevOps) {
        const { breadcrumb, currentContent, getActions } = this.props
        if (breadcrumb !== prevOps.breadcrumb) {
            this.setState({
                data: this.props.breadcrumb,
            })
            if (!isNaN(currentContent.Id)) {
                getActions(currentContent.Id, 'ExploreActions')
            }
        }
    }
    public handleActionMenuClick(e, content) {
        const top = e.pageY - e.target.offsetTop
        const left = e.pageX - e.target.offsetLeft
        this.props.closeActionMenu()
        this.props.openActionMenu(this.props.actions, content.Id, content.DisplayName, e.currentTarget, { top: top + 30, left })
        this.setState({ anchorTop: top, anchorLeft: left })
    }
    public render() {
        const { breadcrumb, currentContent } = this.props
        return <div style={styles.breadCrumb}>
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return breadcrumb.map((n, i) => {
                        if (matches) {
                            return <div style={styles.item} key={i}>
                                <Button
                                    aria-owns="actionmenu"
                                    onClick={
                                        i !== (breadcrumb.length - 1) ?
                                            (event) => this.handleClick(event, n.id) :
                                            (e) => this.handleActionMenuClick(e, currentContent)
                                    }
                                    key={n.id}
                                    style={i === (breadcrumb.length - 1) ? { ...styles.breadCrumbItem, ...styles.breadCrumbItemLast } : styles.breadCrumbItem as any}>
                                    {n.name}
                                    {i !== (breadcrumb.length - 1) ?
                                        '' :
                                        <Icon style={styles.breadCrumbIconLast} onClick={(e) => this.handleActionMenuClick(e, currentContent)}>{icons.arrowDropDown}</Icon>}
                                </Button>
                                {i !== (breadcrumb.length - 1) ?
                                    <Icon style={styles.breadCrumbIcon}>{icons.arrowRight}</Icon> : ''}
                            </div>
                        } else if (!matches && i === (breadcrumb.length - 1)) {
                            return <div style={styles.item} key={i}>
                                <Button onClick={(event) => this.handleClick(event, n.id)}
                                    key={n.id}
                                    style={styles.breadCrumbItem as any}>
                                    {n.name}
                                </Button>
                                {breadcrumb.length > 1 ?
                                    <Icon style={styles.breadCrumbIconLeft as any}>{icons.arrowLeft}</Icon> :
                                    ''}
                                {n.name}
                            </div>
                        } else {
                            return null
                        }
                    })
                }}
            </MediaQuery>
        </div>
    }
}

const mapStateToProps = (state, match) => {

    return {
        breadcrumb: state.dms.breadcrumb,
        currentId: match.match.params.id,
        actions: state.sensenet.currentcontent.actions,
        currentContent: Reducers.getCurrentContent(state.sensenet),
    }
}

export default withRouter(connect(mapStateToProps, {
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
    getActions: Actions.loadContentActions,
})(BreadCrumb))
