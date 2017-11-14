import * as React from 'react'
import { connect } from 'react-redux'
import { Actions } from 'sn-redux'
import Button from 'material-ui/Button';
import FontAwesome from 'react-fontawesome'

class GoogleAuthButton extends React.Component<{ login: Function }, {}>{
    constructor(props){
        super(props)
        
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }
    handleButtonClick(e){
        this.props.login()
    }
    render() {
        return (
            <Button onClick={e => this.handleButtonClick(e)}>
                <FontAwesome name='rocket' />
                Login with Google
        </Button>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {

    }
}

export default connect(mapStateToProps, {
    login: Actions.UserLoginGoogle
})(GoogleAuthButton)