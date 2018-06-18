import { IconButton, LinearProgress, List, ListSubheader, Paper, Snackbar } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { IUploadProgressInfo } from '@sensenet/client-core'
import * as React from 'react'
import { ExtendedUploadProgressInfo } from '../../Actions'
import { resources } from '../../assets/resources'
import theme from '../../assets/theme'
import { UploadBarItem } from './UploadBarItem'

export interface UploadBarProps {
    items: ExtendedUploadProgressInfo[]
    isOpened: boolean
    close: () => void
    removeItem: (item: IUploadProgressInfo) => void
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

    public static getDerivedStateFromProps(newProps: UploadBarProps) {
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
            return {
                isUploadInProgress: !overallProgressPercent.completed,
                overallProgressPercent: overallProgressPercent.completed ? 0 : (overallProgressPercent.uploadedChunks / overallProgressPercent.chunkCount) * 100,
            }
        }
        return {
            isUploadInProgress: false,
            overallProgressPercent: 0,
        }
    }

    private onClose() {
        this.props.close()
    }

    private onRemoveItem(item: IUploadProgressInfo) {
        this.props.removeItem(item)
    }

    public render() {
        return (<Snackbar
            open={this.props.isOpened}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            title={resources.UPLOAD_BAR_TITLE}
        >
            <Paper>
                <List dense={true} subheader={
                    <ListSubheader style={{ backgroundColor: theme.palette.text.primary, color: theme.palette.primary.contrastText, padding: 0, textIndent: '.5em', lineHeight: '2em' }} >
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 1px 3px 4px' }}>
                            <div style={{ color: '#dedede', padding: '3px' }}>{resources.UPLOAD_BAR_TITLE}</div>
                            <IconButton
                                style={{
                                    width: '32px',
                                    height: '32px',
                                }}
                                key="close"
                                aria-label={resources.UPLOAD_BAR_CLOSE_TITLE}
                                color="inherit"
                                onClick={() => this.onClose()}
                            >
                                <Close style={{ width: '25px', height: '24px' }} />
                            </IconButton>
                        </div>
                        {this.state.isUploadInProgress ?
                            <LinearProgress variant="determinate" color="secondary" style={{ backgroundColor: '#C5E1A4' }} value={this.state.overallProgressPercent} />
                            : null}
                    </ListSubheader>}
                    style={{ maxHeight: 400, minWidth: 300, maxWidth: 600, overflowY: 'auto', paddingBottom: 0 }}
                >
                    {this.props.items && this.props.items.filter((item) => item.visible).map((item) => (
                        <UploadBarItem remove={(i) => this.onRemoveItem(i)} key={item.guid} item={item} />
                    ))}
                </List>
            </Paper>
        </Snackbar>)
    }
}
