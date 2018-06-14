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
                    file: null as any,
                    chunkCount: (acc.chunkCount || 0) + (val.chunkCount || 1),
                    uploadedChunks: (acc.uploadedChunks || 0) + (val.uploadedChunks || 0),
                    completed: acc.completed && val.completed && val.content ? true : false,
                    content: null as any,
                    createdContent: null as any,
                }
            })
            this.setState({
                ...this.state,
                isUploadInProgress: !overallProgressPercent.completed,
                overallProgressPercent: overallProgressPercent.completed ? 0 : (overallProgressPercent.uploadedChunks / overallProgressPercent.chunkCount) * 100,
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
                    <ListSubheader style={{ backgroundColor: theme.palette.text.primary, color: theme.palette.primary.contrastText, padding: 0, textIndent: '.5em', lineHeight: '2em' }} >
                        {resources.UPLOAD_BAR_TITLE}
                        {this.state.isUploadInProgress ?
                        <LinearProgress variant="determinate" color="secondary" style={{backgroundColor: theme.palette.secondary.light}} value={this.state.overallProgressPercent} />
                        : null}
                    </ListSubheader>}
                    style={{ maxHeight: 400, minWidth: 300, maxWidth: 600, overflowY: 'auto' }}
                >
                    {this.props.items && this.props.items.map((item) => (
                        <UploadBarItem key={v1()} item={item} />
                    ))}
                </List>
            </Paper>
        </Snackbar>)
    }
}
