import Button from '@material-ui/core/Button'
import * as React from 'react'
import * as FontAwesome from 'react-fontawesome'

import '../assets/css/font-awesome.min.css'

const styles = {
    button: {
        background: '#777',
        color: '#fff',
        boxShadow: '#cacaca 0px 2px 2px',
        minWidth: 60,
        borderRadius: 2,
    },
}

export class WorkspaceChooser extends React.Component<{}, {}> {
    public render() {
        return (
            <div>
                <Button style={styles.button}>
                    <FontAwesome name="sitemap" />
                </Button>
                <div style={{ display: 'none' }}>dropdown</div>
            </div>
        )
    }
}
