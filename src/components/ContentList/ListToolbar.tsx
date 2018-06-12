import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import { BatchActionlist } from '../ActionMenu/BatchActionlist'
import BreadCrumb from '../BreadCrumb'
import { WorkspaceChooser } from '../WorkspaceChooser'

const actions = [
    {
        Name: 'Download',
        DisplayName: 'Download',
        Icon: 'Download',
        Batch: false,
    },
    {
        Name: 'Share',
        DisplayName: 'Share',
        Icon: 'Share',
        Batch: false,
    },
    {
        Name: 'Delete',
        DisplayName: 'Delete',
        Icon: 'Delete',
        Batch: true,
    },
    {
        Name: 'Copy',
        DisplayName: 'Copy',
        Icon: 'Copy',
        Batch: true,
    },
    {
        Name: 'Move',
        DisplayName: 'Move',
        Icon: 'Move',
        Batch: true,
    },
]

export class ListToolbar extends React.Component<{}, {}> {
    public render() {
        return (
            <AppBar position="static" style={{ background: '#fff' }
            }>
                <Toolbar>
                    <WorkspaceChooser />
                    <BreadCrumb />
                    <BatchActionlist actions={actions} />
                </Toolbar>
            </AppBar>
        )
    }
}
