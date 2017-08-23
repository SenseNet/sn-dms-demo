import * as React from 'react'
import LoginTabs from '../components/LoginTabs'
import { WelcomeMessage } from '../components/WelcomeMessage'
import { ContentTypes } from 'sn-client-js'
import { Actions } from 'sn-redux';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/theme'
//import { ShortText, Password, ReactControlMapper } from 'sn-controls-react';

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
  }
}

export const Login = ({ dispatch, handler, props }) => {

  let name, password;
  // let user = ReactControlMapper.GetFullSchemaForContentType(ContentTypes.User, 'new');
  // user.FieldMappings = user.FieldMappings
  //   .filter((FieldSettings) => FieldSettings.FieldSettings.Name === 'LoginName' || FieldSettings.FieldSettings.Name === 'Password');

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
          const name = document.getElementsByClassName('LoginName')['LoginName'].value;
          const password = document.getElementsByClassName('Password')['Password'].value;
          dispatch(Actions.UserLogin(name, password))
          handler(e)
        }}>

          {/* {
            user.FieldMappings.map(function (e, i) {
              return (
                React.createElement(
                  user.FieldMappings[i].ControlType,
                  {
                    ...user.FieldMappings[i].ClientSettings,
                    'data-actionName': 'new',
                    'data-fieldValue': '',
                    'className': user.FieldMappings[i].ClientSettings.key
                  })
              )
            })
          } */}
          <TextField
            id='email'
            label='E-mail'
            InputProps={{ placeholder: 'E-mail' }}
            fullWidth
            //error
            margin='normal'
            autoFocus
            helperText='Error message! Something is not okay.'
            helperTextClassName='error'
            required
          />
          <TextField
            id='password'
            type='password'
            label='Password'
            InputProps={{ placeholder: 'Password' }}
            fullWidth
            //error
            margin='normal'
            helperText='Error message! Something is not okay.'
            helperTextClassName='error'
            required
          />
          <Button color='primary' style={styles.button}>Login</Button>
        </form>
        </MuiThemeProvider>
      </div>
    </div>
  )
}