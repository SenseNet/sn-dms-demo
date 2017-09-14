import * as React from 'react'
import Header from '../components/Header'
import { FloatingActionButton } from '../components/FloatingActionButton'
import DocumentLibrary from '../components/DocumentLibrary'

const styles = {
    dashBoarInner: {
        padding: 60
    },
    root: {
        background: '#efefef'
    }
}

class Dashboard extends React.Component<{ match }, { currentId }>{
    constructor(props) {
        super(props)
        this.state = {
            currentId: this.props.match.params.id ? this.props.match.params.id : ''
        }
    }
    render() {
        return (
            <div style={styles.root}>
                <Header />
                <div style={styles.dashBoarInner}>
                    <DocumentLibrary currentId={this.state.currentId} />
                </div>
                <FloatingActionButton />
            </div>
        )
    }
}

export default Dashboard