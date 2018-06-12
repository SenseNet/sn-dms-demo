import { IconButton, List, ListItem, ListItemText, Snackbar } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { IUploadProgressInfo } from '@sensenet/client-core'
import * as React from 'react'
import { resources } from '../../assets/resources'

export interface UploadBarProps {
    items: IUploadProgressInfo[]
    isOpened: boolean
    handleSelectItem?: (item: IUploadProgressInfo) => void
}

export interface UploadBarState {
    overallProgressPercent: number
}

export class UploadBar extends React.Component<UploadBarProps, UploadBarState> {

    public state: UploadBarState = {
        overallProgressPercent: 0,
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
                    // onClick={this.close}
                >
                    <Close />
                </IconButton>,
            ]}
            message={<List>
                {this.props.items && this.props.items.map((item) => (
                    <ListItem>
                        <ListItemText primary={item.createdContent.Name} />
                    </ListItem>
                ))}
            </List>}
            >
        </Snackbar>)
    }
}
