import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import BatchActionlist from './ActionMenu/BatchActionlist'
import BreadCrumb from './BreadCrumb'
import { WorkspaceSelector } from './WorkspaceSelector/WorkspaceSelector'

export class ListToolbar extends React.Component<{}, {}> {
    public render() {
        return (
            <AppBar position="static" style={{ background: '#fff' }
            }>
                <Toolbar style={{ display: 'flex', flexDirection: 'row', padding: '0 12px' }}>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <WorkspaceSelector />
                        <BreadCrumb />
                    </div>
                    <BatchActionlist />
                </Toolbar>
            </AppBar>
        )
    }
}
