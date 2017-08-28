import * as React from 'react'
import { connect } from 'react-redux';
import { Reducers } from 'sn-redux'
import LoginTabs from '../components/LoginTabs'
import { WelcomeMessage } from '../components/WelcomeMessage'
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/theme'

const logo = require('../assets/logo.png');

import lightBlue from 'material-ui/colors/lightBlue'
import pink from 'material-ui/colors/pink'
import createPalette from 'material-ui/styles/palette'

const muiTheme = createMuiTheme({
  palette: createPalette({
    primary: lightBlue,
    accent: pink
  })
})

const styles = {
  button: {
    margin: '10px 0',
    width: '100%'
  },
  formControl: {
    marginTop: '20px 0px',
  }
}

import { resources } from '../assets/resources'

interface IRegistrationProps {
  registration,
  params,
  registrationError
}

interface IRegistrationState {
  email,
  password,
  password2,
  emailError,
  passwordError,
  emailErrorMessage,
  passwordErrorMessage,
  formIsValid,
  isButtonDisabled
}

class Registration extends React.Component<IRegistrationProps, IRegistrationState> {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      password2: '',
      emailError: false,
      passwordError: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      formIsValid: false,
      isButtonDisabled: false
    }

    this.handleEmailBlur = this.handleEmailBlur.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailBlur(e) {
    if (this.validateEmail(e.target.value)) {
      this.setState({
        email: e.target.value,
        emailErrorMessage: '',
        emailError: false
      })
    }
    else {
      this.setState({
        emailErrorMessage: resources.EMAIL_IS_NOT_VALID_MESSAGE,
        emailError: true
      })
    }
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    })
  }

  validateEmail(text) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
  }

  render() {
    return (
      <div>
        <div className='Sensenet-header'>
          <img src={logo} className='Sensenet-logo' alt='logo' />
        </div>

        <LoginTabs />
        <WelcomeMessage />

        <div>
          <MuiThemeProvider theme={muiTheme}>
            <form onSubmit={e => {
              e.preventDefault()
              // TODO: form submit
              // this.formSubmit(e)
            }}>
              <FormControl
                error={this.state.emailError || (this.props.registrationError && this.props.registrationError.length) > 0 ? true : false}
                fullWidth
                required
                style={styles.formControl}>
                <InputLabel htmlFor='email'>{resources.EMAIL_INPUT_LABEL}</InputLabel>
                <Input
                  id='email'
                  onBlur={(event) => this.handleEmailBlur(event)}
                  onChange={(event) => this.handleEmailChange(event)}
                  fullWidth
                  autoFocus
                  placeholder={resources.EMAIL_INPUT_FORMAT_PLACEHOLDER} />
                <FormHelperText>{this.state.emailErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl
                error={this.state.passwordError || (this.props.registrationError && this.props.registrationError.length) ? true : false}
                fullWidth
                required
                style={styles.formControl}>
                <InputLabel htmlFor='password'>{resources.PASSWORD_INPUT_LABEL}</InputLabel>
                <Input
                  type='password'
                  id='password'
                  //TODO: onblur
                  //onBlur={(event) => this.handlePasswordBlur(event)}
                  //TODO: onchange
                  //onChange={(event) => this.handlePasswordChange(event)}
                  fullWidth
                  placeholder={resources.PASSWORD_INPUT_PLACEHOLDER} />
                <FormHelperText>{this.state.passwordErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl
                error={this.state.passwordError || (this.props.registrationError && this.props.registrationError.length) ? true : false}
                fullWidth
                required
                style={styles.formControl}>
                <InputLabel htmlFor='password'>{resources.PASSWORD_INPUT_LABEL}</InputLabel>
                <Input
                  type='password'
                  id='password2'
                  //TODO: onblur
                  //onBlur={(event) => this.handlePasswordBlur(event)}
                  //TODO: onchange
                  //onChange={(event) => this.handlePasswordChange(event)}
                  fullWidth
                  placeholder={resources.PASSWORD_INPUT_PLACEHOLDER} />
                <FormHelperText>{this.state.passwordErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormHelperText error>{this.props.registrationError && this.props.registrationError.length ? resources.WRONG_USERNAME_OR_PASSWORD : ''}</FormHelperText>
              </FormControl>
              <Button 
              type='submit' 
              color='primary' 
              style={styles.button} 
              //TODO: disabled button
              //disabled={this.buttonIsDisabled ? true : false}
              >
              {resources.REGISTRATION_BUTTON_TEXT}</Button>
            </form>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, match) => {
  return {
    registrationError: ''
  }
}

export default connect(mapStateToProps, {})(Registration)