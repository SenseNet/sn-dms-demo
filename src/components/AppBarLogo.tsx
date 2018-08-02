import * as React from 'react'
import MediaQuery from 'react-responsive'
import {
    Link,
} from 'react-router-dom'

const styles = {
    logo: {
        flex: 1,
        color: '#fff',
        width: 40,
        textDecoration: 'none' as any,
        fontFamily: 'Raleway Regular',
    },
    logoSpan: {
        fontFamily: 'Raleway Regular',
        fontWeight: '600' as any,
    },
    logoMobile: {
        flex: 1,
        marginLeft: 0,
        width: 25,
    },
    logoImg: {
        maxWidth: 25,
        maHeight: 25,
        verticalAlign: 'middle' as any,
        marginRight: 5,
    },
    logoImgMobile: {
        maxWidth: 25,
        maHeight: 25,
        verticalAlign: 'middle' as any,
        marginRight: 0,
    },
    logoText: {
        display: 'inline-block' as any,
        verticalAlign: 'middle' as any,
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
                        <span style={styles.logoSpan}>sense</span>net
                        </span>
                </Link>
            } else {
                return <Link to="/" style={{ ...styles.logo, ...styles.logoMobile }} >
                    <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={styles.logoImgMobile} />
                </Link>
            }
        }}
    </MediaQuery>

)

export default appBarLogo
