import { LoginState } from '@sensenet/client-core'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Route,
  withRouter,
} from 'react-router-dom'
import 'typeface-roboto'
import * as DMSActions from './Actions'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Registration from './pages/Registration'
import './Sensenet.css'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import theme from './assets/theme'

interface SensenetProps {
  repository,
  history,
  loginState,
  loggedinUser,
  loginError: string,
  registrationError: string,
  login,
  registration,
  recaptchaCallback,
  clearRegistration,
  oAuthProvider
}

class Sensenet extends React.Component<SensenetProps, { isAuthenticated: boolean, params, loginError, registrationError }> {
  public name: string = ''
  public password: string = ''

  constructor(props, context) {
    super(props, context)

    this.state = {
      params: this.props,
      isAuthenticated: false,
      loginError: this.props.loginError || '',
      registrationError: this.props.loginError || '',
    }
  }
  public render() {
    return (

      <MuiThemeProvider theme={theme}>
        <div className="root">
          <Route
            exact
            path="/"
            render={(routerProps) => {
              const status = this.props.loginState === LoginState.Unauthenticated
              return status ? <Redirect key="login" to="/login" /> :
              <Dashboard {...routerProps} />
            }}
          />
          <Route
            path="/login"
            render={(routerProps) => {
              const status = this.props.loginState === LoginState.Authenticated
              return status ?
                <Redirect key="dashboard" to="/" /> :
                <Login login={this.props.login} params={{ error: this.props.loginError, oAuthProvider: this.props.oAuthProvider }} clear={this.props.clearRegistration} />
            }}
          />
          <Route
            path="/registration"
            render={() => <Registration oAuthProvider={this.props.oAuthProvider} registration={this.props.registration} history={history} verify={this.props.recaptchaCallback} />} />
          <Route path="/:id"
            render={(routerProps) => {
              const status = this.props.loginState !== LoginState.Authenticated
              return status ?
                <Redirect key="login" to="/login" />
                : <Dashboard {...routerProps} />
            }} />
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state, match) => {
  return {
    loginState: Reducers.getAuthenticationStatus(state.sensenet),
    loginError: Reducers.getAuthenticationError(state.sensenet),
    registrationError: '',
  }
}

const userLogin = Actions.userLogin
const userRegistration = DMSActions.userRegistration
const verifyCaptcha = DMSActions.verifyCaptchaSuccess
const clearReg = DMSActions.clearRegistration

export default withRouter(connect(
  mapStateToProps,
  {
    login: userLogin,
    registration: userRegistration,
    recaptchaCallback: verifyCaptcha,
    clearRegistration: clearReg,
  })(Sensenet))
