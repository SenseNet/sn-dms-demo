import * as React from 'react'
import LoginTabs from '../components/LoginTabs'
import { WelcomeMessage } from '../components/WelcomeMessage'

const logo = require('../assets/logo.png');

export const Registration = () => (
  <div>
    <div className='Sensenet-header'>
      <img src={logo} className='Sensenet-logo' alt='logo' />
    </div>

    <LoginTabs />
    <WelcomeMessage />
    <div>
      <h2>Registration</h2>
    </div>
  </div>
)