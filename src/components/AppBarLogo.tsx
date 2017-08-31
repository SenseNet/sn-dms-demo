import * as React from 'react'
import { withRouter } from 'react-router'
import {
    Link
  } from 'react-router-dom'

const styles = {
    logo: {
        flex: 1,
        color: '#fff'
    }
}

const AppBarLogo = () => (
    <Link to='/' style={styles.logo}>
        <img src='' alt='sensenet' aria-label='sensenet'  />
    </Link>
)

export default withRouter(AppBarLogo)