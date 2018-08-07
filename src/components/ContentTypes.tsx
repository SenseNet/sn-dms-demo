import { AppBar, Toolbar, Typography } from '@material-ui/core'
import * as React from 'react'

// tslint:disable-next-line:variable-name
export const ContentTypes: React.StatelessComponent = (props) => {
    return (<AppBar position="static" style={{ background: '#fff' }
    }>
        <Toolbar style={{ display: 'flex', flexDirection: 'row', padding: '0 12px' }}>
            <div style={{ flex: 1, display: 'flex' }}>
                <Typography variant="headline">Content Types</Typography>
            </div>
        </Toolbar>
    </AppBar>)
}