import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import * as DMSReducers from '../Reducers'

class GoogleReCaptcha extends React.Component<{ verify }, { recaptchaResponse }> {
    constructor(props) {
        super(props)
    }
    public onChange(response) {
        this.setState({
            recaptchaResponse: response,
        })
        if (this.state.recaptchaResponse) {
            this.props.verify(response)
        }
    }
    public render() {
        return (
            <ReCAPTCHA
                ref="recaptcha"
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY || '6LcRiy4UAAAAANJjCL8H5c4WG2YeejRuA35e1gcU'}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        isNotARobot: DMSReducers.captchaIsVerified(state.dms.register),
    }
}

export default connect(mapStateToProps, {})(GoogleReCaptcha)
