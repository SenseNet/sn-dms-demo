import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { IOauthProvider } from '@sensenet/authentication-jwt'
import { LoginState } from '@sensenet/client-core'
import * as React from 'react'
import CookieConsent from 'react-cookie-consent'
import * as Loadable from 'react-loadable'
import { connect } from 'react-redux'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import 'typeface-roboto'
import { rootStateType } from '.'
import * as DMSActions from './Actions'
import { dmsTheme } from './assets/dmstheme'
import { AuthorizedRoute } from './components/AuthorizedRoute'
import { FullScreenLoader } from './components/FullScreenLoader'
import MessageBar from './components/MessageBar'
import Login from './pages/Login'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Registration from './pages/Registration'
import './Sensenet.css'

const styles = {
  cookieConsentContainer: {
    backgroundColor: 'rgb(47, 47, 47)',
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: 'rgb(255, 255, 255)',
    fontSize: '12px',
    maxWidth: '400px',
    margin: '20px',
    borderRadius: '10px',
  },
  acceptCookiesButton: {
    color: '#fff',
    fontSize: '12px',
    backgroundColor: 'rgb(72, 165, 84)',
    cursor: 'pointer',
  },
}

const mapStateToProps = (state: rootStateType) => {
  return {
    loginState: state.sensenet.session.loginState,
    currentUserId: state.sensenet.session.user.content.Id,
  }
}

const verifyCaptcha = DMSActions.verifyCaptchaSuccess
const clearReg = DMSActions.clearRegistration

const mapDispatchToProps = {
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
    // if (this.props.loginState === LoginState.Pending
    //   || (this.props.loginState === LoginState.Authenticated && this.props.currentUserId === ConstantContent.VISITOR_USER.Id)) {
    //   return null
    // }
    return (
      <MuiThemeProvider theme={dmsTheme}>
        <div className="root" style={{ height: window.innerHeight }}>
          <HashRouter>
            <Switch>
              <AuthorizedRoute exact path="/login" authorize={() => this.props.loginState !== LoginState.Authenticated} redirectOnUnauthorized="/">
                <Login oauthProvider={this.props.oAuthProvider} clear={this.props.clearRegistration} />
              </AuthorizedRoute>
              <AuthorizedRoute exact path="/registration" authorize={() => this.props.loginState !== LoginState.Authenticated} redirectOnUnauthorized="/">
                <Registration oAuthProvider={this.props.oAuthProvider} verify={this.props.recaptchaCallback} />
              </AuthorizedRoute>

              <AuthorizedRoute exact path="/privacypolicy" authorize={() => this.props.loginState !== LoginState.Authenticated} redirectOnUnauthorized="/">
                <PrivacyPolicy />
              </AuthorizedRoute>

              {/* Empty path, default routes per login state */}
              {this.props.loginState === LoginState.Unauthenticated ? <Redirect path="*" to="/login" /> : null}
              {/* {this.props.loginState === LoginState.Authenticated ? <Redirect path="*" to="/" /> : null} */}

              <AuthorizedRoute path="/" authorize={() => this.props.loginState !== LoginState.Unauthenticated} redirectOnUnauthorized="/" render={(routerProps) => {
                const LoadableDashboard = Loadable({
                  loader: () => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'),
                  loading: () => <FullScreenLoader />,
                })
                return <LoadableDashboard {...routerProps} />
              }}>
              </AuthorizedRoute>

              {/* Not found */}
              <Route path="*" exact={true} >
                <Redirect to="/" />
              </Route>
            </Switch>
          </HashRouter>
        </div>
        <MessageBar />
        <CookieConsent
          location="bottom"
          buttonText="I accept cookies"
          style={styles.cookieConsentContainer}
          buttonStyle={styles.acceptCookiesButton}
        >
          We use cookies to be able to provide social media features, analyse our traffic and behaviour of the visitors on our website and for marketing purposes. Sometimes we share this anonymised information to 3rd party partner companies. <a href="https://www.eucookie.eu/en/cookieinfo/?url=community.sensenet.com" target="_blank">More information</a>{' '}
        </CookieConsent>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sensenet)
