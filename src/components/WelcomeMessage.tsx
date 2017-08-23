import * as React from 'react'

const style = {
    welcome: {
        fontSize: '13px',
        lineHeight: '20px',
        textAlign: 'left',
        margin: '20px 10px'
    }
}

export const WelcomeMessage = () => (
    <p style={style.welcome}>
        Welcome to the sensenet ECM Document Management System Experiment! We are thrilled to have you here. Please log in, or register!
    </p>
)