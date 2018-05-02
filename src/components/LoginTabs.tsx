import AppBar from 'material-ui/AppBar'
import createMuiTheme from 'material-ui/styles/createMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Tabs, { Tab } from 'material-ui/Tabs'
import * as React from 'react'
import {
    withRouter,
} from 'react-router-dom'

import blue from 'material-ui/colors/blue'
import pink from 'material-ui/colors/pink'

const muiTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: pink,
    },
})

const styles = {
    tabLink: {
        display: 'flex' as any,
        alignItems: 'center' as any,
        justifyContent: 'center' as any,
    },
}

import { resources } from '../assets/resources'

class LoginTabs extends React.Component<{ history }, { value }> {
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
            <MuiThemeProvider theme={muiTheme}>
                <div>
                    <AppBar position="static">
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            fullWidth
                            centered>
                            <Tab
                                label={resources.LOGIN_TAB_TEXT}
                                style={styles.tabLink as any} />
                            <Tab
                                label={resources.REGISTER_TAB_TEXT}
                                style={styles.tabLink as any} />
                        </Tabs>
                    </AppBar>
                </div>
            </MuiThemeProvider>)
    }
}

export default withRouter(LoginTabs)
