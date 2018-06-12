import { IconButton, Snackbar } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { IUploadProgressInfo } from '@sensenet/client-core'
import * as React from 'react'
import { resources } from '../../assets/resources'

export interface UploadBarProps {
    items: IUploadProgressInfo[]
    handleSelectItem?: (item: IUploadProgressInfo) => void
}

export interface UploadBarState {
    isOpened: boolean
    overallProgressPercent: number
}

export class UploadBar extends React.Component<UploadBarProps, UploadBarState> {

    private open = () => this.setState({
        ...this.state,
        isOpened: true,
    })

    private close = () => this.setState({
        ...this.state,
        isOpened: false,
    })

    public render() {
        return (<Snackbar
            open={this.state.isOpened}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            title={resources.UPLOAD_BAR_TITLE}
            action={[
                <IconButton
                    key="close"
                    aria-label={resources.UPLOAD_BAR_CLOSE_TITLE}
                    color="inherit"
                    onClick={this.close}
                >
                    <Close />
                </IconButton>,
            ]}>
        </Snackbar>)
    }
}
