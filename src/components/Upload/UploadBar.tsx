import { Icon, IconButton, LinearProgress, List, ListSubheader, Paper, Snackbar } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { IUploadProgressInfo } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { v1 } from 'uuid'
import { resources } from '../../assets/resources'
import theme from '../../assets/theme'
import { UploadBarItem } from './UploadBarItem'

export interface UploadBarProps {
    items: Array<IUploadProgressInfo & { content: GenericContent }>
    isOpened: boolean
    handleSelectItem?: (item: IUploadProgressInfo) => void
}

export interface UploadBarState {
    overallProgressPercent: number,
    isUploadInProgress: boolean,
}

export class UploadBar extends React.Component<UploadBarProps, UploadBarState> {

    public state: UploadBarState = {
        overallProgressPercent: 0,
        isUploadInProgress: false,
    }

    public componentWillReceiveProps(newProps: this['props']) {
        if (newProps.items && newProps.items.length) {
            const overallProgressPercent = newProps.items.reduce((acc, val) => {
                return {
                    guid: '',
                    file: undefined as any,
                    chunkCount: acc.chunkCount + val.chunkCount,
                    uploadedChunks: acc.uploadedChunks + val.uploadedChunks,
                    completed: acc.completed || val.completed,
                    content: null as any,
                    createdContent: null as any,
                }
            })
            this.setState({
                ...this.state,
                isUploadInProgress: !overallProgressPercent.completed,
                overallProgressPercent: (overallProgressPercent.uploadedChunks / overallProgressPercent.chunkCount) * 100,
            })
        }
    }

    public render() {
        return (<Snackbar
            open={this.props.isOpened}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            title={resources.UPLOAD_BAR_TITLE}
            action={[
                <IconButton
                    key="close"
                    aria-label={resources.UPLOAD_BAR_CLOSE_TITLE}
                    color="inherit"
                >
                    <Close />
                </IconButton>,
            ]}
        >
            <Paper>
                <List dense={true} subheader={
                    <ListSubheader style={{ backgroundColor: theme.palette.text.primary, color: theme.palette.primary.contrastText }} >
                        {resources.UPLOAD_BAR_TITLE}
                    </ListSubheader>}
                    style={{ maxHeight: 400, maxWidth: 600, overflow: 'auto' }}
                >
                    {this.state.isUploadInProgress ?
                        <LinearProgress variant="determinate" value={this.state.overallProgressPercent} />
                        : null}
                    {this.props.items && this.props.items.map((item) => (
                        <UploadBarItem key={v1()} item={item} />
                    ))}
                </List>
            </Paper>
        </Snackbar>)
    }
}
