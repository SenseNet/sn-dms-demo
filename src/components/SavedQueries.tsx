import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import * as React from 'react'

export const SavedQueries: React.StatelessComponent = (props) => {
    return (<AppBar position="static" style={{ background: '#fff' }
    }>
        <Toolbar style={{ display: 'flex', flexDirection: 'row', padding: '0 12px' }}>
            <div style={{ flex: 1, display: 'flex' }}>
                <Typography variant="headline">Saved Queries</Typography>
            </div>
        </Toolbar>
    </AppBar>)
}
