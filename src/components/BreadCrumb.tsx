import * as React from 'react'
import { connect } from 'react-redux'
import {
    withRouter
} from 'react-router-dom'
import MediaQuery from 'react-responsive';
import { DMSActions } from '../Actions'
import { DMSReducers } from '../Reducers'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon';

import { icons } from '../assets/icons'
const styles = {
    breadCrumb: {},
    breadCrumbItem: {
        color: '#fff'
    },
    breadCrumbIcon: {
        marginLeft: 30
    },
    breadCrumbIconLeft: {
        marginRight: 30
    },
}

class BreadCrumb extends React.Component<{ breadcrumb, history }, {}>{
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e, id) {
        this.props.history.push(`/${id}`)
    }
    componentDidUpdate(prevOps) {
        if (this.props.breadcrumb !== prevOps.breadcrumb) {
            this.setState({
                data: this.props.breadcrumb
            })
        }
    }
    render() {
        return <div style={styles.breadCrumb}>
            <AppBar position="static">
                <Toolbar>
                    <MediaQuery minDeviceWidth={700}>
                        {(matches) => {
                            return this.props.breadcrumb.map((n, i) => {
                                if (matches) {
                                    return <Button onClick={event => this.handleClick(event, n.id)}
                                        key={n.id}
                                        style={styles.breadCrumbItem}>
                                        {n.name}
                                        {i !== (this.props.breadcrumb.length - 1) ?
                                            <Icon style={styles.breadCrumbIcon}>{icons.arrowRight}</Icon> :
                                            ''}
                                    </Button>
                                }
                                else if (!matches && i === (this.props.breadcrumb.length - 1)) {
                                    return <Button onClick={event => this.handleClick(event, n.id)}
                                        key={n.id}
                                        style={styles.breadCrumbItem}>
                                        {this.props.breadcrumb.length > 1 ?
                                            <Icon style={styles.breadCrumbIconLeft}>{icons.arrowLeft}</Icon> :
                                            ''}
                                        {n.name}
                                    </Button>
                                }
                                else {
                                    return null
                                }
                            })
                        }}
                    </MediaQuery>
                </Toolbar>
            </AppBar>
        </div>
    }
}

const mapStateToProps = (state, match) => {

    return {
        breadcrumb: DMSReducers.getBreadCrumbArray(state.dms),
        currentId: match.match.params.id
    }
}

export default withRouter(connect(mapStateToProps, {})(BreadCrumb))