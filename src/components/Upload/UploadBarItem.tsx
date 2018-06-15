import { CircularProgress, Icon, IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import { CheckCircle, Close, Error } from '@material-ui/icons'
import { IUploadProgressInfo } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import theme from '../../assets/theme'

export interface UploadBarItemProps {
    item: IUploadProgressInfo & { content: GenericContent }
    handleSelectItem?: (item: IUploadProgressInfo) => void
    remove: (item: IUploadProgressInfo) => void
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
            icon: icons[(newProps.item.content ? newProps.item.content.Icon : 'File')],
            percent: newProps.item && (newProps.item.uploadedChunks / newProps.item.chunkCount) * 100 || 0,
            isLoading: (newProps.item.error || newProps.item.completed && newProps.item.content) ? false : true,
        }
    }

    private onRemoveItem() {
        this.props.remove(this.props.item)
    }

    public shouldComponentUpdate(nextProps: UploadBarItemProps, nextState: UploadBarItemState) {
        return this.props.item.error === nextProps.item.error
            || JSON.stringify(nextState) === JSON.stringify(this.state)
            || false
    }

    public render() {
        return (
        <ListItem style={{ padding: '.3em', opacity: this.state.isLoading ? 0.65 : 1 }}>
            <ListItemIcon style={{ marginRight: '-.5em' }}>
                <Icon style={{ color: theme.palette.secondary.main }}>{this.state.icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {this.state.displayName}
                </div>
            } inset style={{ padding: '0 25px 0 14px' }} title={this.state.displayName} />
            <ListItemSecondaryAction>
                {this.state.isLoading ?
                    <div>
                        <IconButton
                            style={{
                                width: '24px',
                                height: '24px',
                            }}
                            key="close"
                            aria-label={resources.UPLOAD_BAR_CLOSE_TITLE}
                            color="inherit"
                            onClick={() => this.onRemoveItem()}
                        >
                            <Close style={{ width: '15px', height: '15px' }} color="primary"/>
                        </IconButton>
                    </div>
                    : null}
                {this.props.item.error ? <Error color="error" style={{ verticalAlign: 'middle' }} /> : null}
                {!this.state.isLoading && !this.props.item.error ? <CheckCircle color="secondary" style={{ verticalAlign: 'middle' }} /> : null}
            </ListItemSecondaryAction>
        </ListItem>)
    }
}
