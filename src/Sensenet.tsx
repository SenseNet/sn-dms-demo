import { LoginState } from '@sensenet/client-core'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import 'typeface-roboto'
import * as DMSActions from './Actions'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Registration from './pages/Registration'
import './Sensenet.css'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { IOauthProvider } from '@sensenet/authentication-jwt'
import { rootStateType } from '.'
import theme from './assets/theme'
import { AuthorizedRoute } from './components/AuthorizedRoute'

const mapStateToProps = (state: rootStateType) => {
  return {
    loginState: state.sensenet.session.loginState,
    loginError: state.sensenet.session.error,
    registrationError: '',
  }
}

const userLogin = Actions.userLogin
const userRegistration = DMSActions.userRegistration
const verifyCaptcha = DMSActions.verifyCaptchaSuccess
const clearReg = DMSActions.clearRegistration

const mapDispatchToProps = {
  login: userLogin,
  registration: userRegistration,
  recaptchaCallback: verifyCaptcha,
  clearRegistration: clearReg,
}

export interface SensenetProps {
  oAuthProvider: IOauthProvider
}

class Sensenet extends React.Component<SensenetProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {
  public name: string = ''
  public password: string = ''

  constructor(props: Sensenet['props']) {
    super(props)
  }
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="root">
          <HashRouter>
            <Switch>
              <AuthorizedRoute exact path="/login" authorize={() => this.props.loginState !== LoginState.Authenticated} redirectOnUnauthorized="/">
                <Login oauthProvider={this.props.oAuthProvider} clear={this.props.clearRegistration} />
              </AuthorizedRoute>
              <AuthorizedRoute exact path="/registration" authorize={() => this.props.loginState !== LoginState.Authenticated} redirectOnUnauthorized="/">
                <Registration oAuthProvider={this.props.oAuthProvider} verify={this.props.recaptchaCallback} />
              </AuthorizedRoute>

              {/* Empty path, default routes per login state */}
              {this.props.loginState === LoginState.Unauthenticated ? <Redirect path="*" to="/login" /> : null}
              {/* {this.props.loginState === LoginState.Authenticated ? <Redirect path="*" to="/" /> : null} */}

              <AuthorizedRoute path="/" authorize={() => this.props.loginState !== LoginState.Unauthenticated} redirectOnUnauthorized="/" render={(routerProps) => {
                return <Dashboard {...routerProps} />
              }}>
              </AuthorizedRoute>

              {/* Not found */}
              <Route path="*" exact={true} >
                <Redirect to="/" />
              </Route>
            </Switch>
          </HashRouter>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sensenet)
