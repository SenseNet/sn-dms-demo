import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import BatchActionlist from './ActionMenu/BatchActionlist'
import BreadCrumb from './BreadCrumb'
import { WorkspaceSelector } from './WorkspaceSelector/WorkspaceSelector'

export interface ListToolbarProps {
    currentContent: GenericContent,
    selected: GenericContent[],
    ancestors: GenericContent[]
}

export class ListToolbar extends React.Component<ListToolbarProps, {}> {
    public render() {
        return (
            <AppBar position="static" style={{ background: '#fff' }
            }>
                <Toolbar style={{ display: 'flex', flexDirection: 'row', padding: '0 12px' }}>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <WorkspaceSelector />
                        <BreadCrumb ancestors={this.props.ancestors} />
                    </div>
                    <BatchActionlist currentContent={this.props.currentContent} selected={this.props.selected} />
                </Toolbar>
            </AppBar>
        )
    }
}
