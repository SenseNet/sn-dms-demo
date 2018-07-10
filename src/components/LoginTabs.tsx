import { withStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import createStyles from '@material-ui/core/styles/createStyles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import * as React from 'react'
import {
    withRouter,
} from 'react-router-dom'

const styles = {
    tabLink: {
        display: 'flex' as any,
        alignItems: 'center' as any,
        justifyContent: 'center' as any,
        fontSize: '15px !important',
    },
}

const style = () => createStyles({
    button: {
        fontSize: '15px',
        color: '#fff',
        fontFamily: 'Raleway Bold',
    },
    label: {
        fontSize: '15px',
    },
})

import { resources } from '../assets/resources'

class LoginTabs extends React.Component<{ history, classes }, { value }> {
    constructor(props) {
        super(props)
        this.state = {
            value: location.href.indexOf('login') !== -1 ? 0 : 1,
        }
        this.handleChange = this.handleChange.bind(this)
    }
    public handleChange = (event, value) => {
        this.setState({ value })
        return value === 0 ?
            this.props.history.push('/login') :
            this.props.history.push('/registration')
    }
    public render() {
        const { value } = this.state
        return (
            <div>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        fullWidth
                        indicatorColor="primary"
                        centered>
                        <Tab
                            label={resources.LOGIN_TAB_TEXT}
                            style={styles.tabLink as any}
                            classes={{
                                label: this.props.classes.label,
                            }} />
                        <Tab
                            label={resources.REGISTER_TAB_TEXT}
                            style={styles.tabLink as any}
                            classes={{
                                label: this.props.classes.label,
                            }}
                        />
                    </Tabs>
                </AppBar>
            </div>)
    }
}

export default withRouter(withStyles(style, { withTheme: true })(LoginTabs as any))
