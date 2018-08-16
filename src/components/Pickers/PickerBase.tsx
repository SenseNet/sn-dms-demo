import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {}
}

class Picker extends React.Component<ReturnType<typeof mapStateToProps>, {}> {
    public render() {
        return (
            <div></div>
        )
    }
}

export default connect(mapStateToProps, {})(Picker)
