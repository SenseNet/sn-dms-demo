import { CircularProgress, Icon, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import { CheckCircle, Error } from '@material-ui/icons'
import { IUploadProgressInfo } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { icons } from '../../assets/icons'
import theme from '../../assets/theme'

export interface UploadBarItemProps {
    item: IUploadProgressInfo & { content: GenericContent }
    handleSelectItem?: (item: IUploadProgressInfo) => void
}

export interface UploadBarItemState {
    icon: string
    displayName: string
    percent: number
    isLoading: boolean

}

export class UploadBarItem extends React.Component<UploadBarItemProps, UploadBarItemState> {

    public state = { icon: 'File', displayName: '', percent: 0, isLoading: true }

    public static getDerivedStateFromProps(newProps: UploadBarItemProps) {
        return {
            displayName: newProps.item.content ? newProps.item.content.DisplayName : newProps.item.createdContent && newProps.item.createdContent.Name || newProps.item.file.name,
            icon: newProps.item.content ? newProps.item.content.Icon : 'File',
            percent: newProps.item && (newProps.item.uploadedChunks / newProps.item.chunkCount) * 100 || 0,
            isLoading: (newProps.item.error || newProps.item.completed && newProps.item.content) ? false : true,
        }
    }

    public render() {
        return (<ListItem style={{padding: '.3em', opacity: this.props.item.completed ? 1 : 0.75}}>
            <ListItemIcon style={{marginRight: '-.5em'}}>
                <Icon style={{color: theme.palette.secondary.main}}>{icons[this.state.icon] || 'File'}</Icon>
            </ListItemIcon>
            <ListItemText primary={this.state.displayName} />
            <ListItemSecondaryAction>
                {this.state.isLoading ?
                <CircularProgress size={23} color="secondary" variant="indeterminate" value={this.state.percent} />
                : null}
                {this.props.item.error ? <Error style={{color: theme.palette.error.main}} /> : null}
                {!this.state.isLoading && !this.props.item.error ?  <CheckCircle style={{color: theme.palette.secondary.main}} /> : null}
            </ListItemSecondaryAction>
        </ListItem>)
    }
}
