import * as React from 'react'
import MediaQuery from 'react-responsive'
import { withRouter } from 'react-router'
import {
    Link,
} from 'react-router-dom'

const styles = {
    logo: {
        flex: 1,
        color: '#fff',
        width: 40,
        textDecoration: 'none' as any,
        fontFamily: 'roboto',
        marginLeft: 24,
    },
    logoMobile: {
        flex: 1,
        marginLeft: 0,
        width: 30,
    },
    logoImg: {
        maxWidth: 30,
        maHeight: 30,
        verticalAlign: 'middle' as any,
        marginRight: 10,
    },
    logoImgMobile: {
        maxWidth: 30,
        maHeight: 30,
        verticalAlign: 'middle' as any,
        marginRight: 0,
    },
    logoText: {
        display: 'inline-block' as any,
    },
}

// tslint:disable-next-line:no-var-requires
const sensenetLogo = require('../assets/sensenet_white.png')

const appBarLogo = () => (
    <MediaQuery minDeviceWidth={700}>
        {(matches) => {
            if (matches) {
                return <Link to="/" style={styles.logo} >
                    <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={styles.logoImg} />
                    <span style={styles.logoText}>
                        sensenet DMS
                        </span>
                </Link>
            } else {
                return <Link to="/" style={{...styles.logo, ...styles.logoMobile}} >
                    <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={styles.logoImgMobile} />
                </Link>
            }
        }}
    </MediaQuery>

)

export default withRouter(appBarLogo)
