import { CircularProgress, Icon, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import { IUploadProgressInfo } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { icons } from '../../assets/icons'

export interface UploadBarItemProps {
    item: IUploadProgressInfo & { content: GenericContent }
    handleSelectItem?: (item: IUploadProgressInfo) => void
}

export interface UploadBarItemState {
    icon: string
    displayName: string
    percent: number

}

export class UploadBarItem extends React.Component<UploadBarItemProps, UploadBarItemState> {

    public state = { icon: 'File', displayName: '', percent: 0 }

    public static getDerivedStateFromProps(newProps: UploadBarItemProps) {
        return {
            displayName: newProps.item.content ? newProps.item.content.DisplayName : newProps.item.createdContent && newProps.item.createdContent.Name || newProps.item.file.name,
            icon: newProps.item.content ? newProps.item.content.Icon : 'File',
            percent: newProps.item && (newProps.item.uploadedChunks / newProps.item.chunkCount) * 100 || 0,
        }
    }

    public render() {
        return (<ListItem>
            <ListItemIcon>
                <Icon color="primary">{icons[this.state.icon] || 'File'}</Icon>
            </ListItemIcon>
            <ListItemText primary={this.state.displayName} />
            {this.props.item.completed ? null :
                <ListItemSecondaryAction>
                    <CircularProgress variant="determinate" value={this.state.percent} />
                </ListItemSecondaryAction>}
        </ListItem>)
    }
}
