import { IconButton, Snackbar } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { IUploadProgressInfo } from '@sensenet/client-core'
import { File as SnFile } from '@sensenet/default-content-types'
import * as React from 'react'
import { resources } from '../../assets/resources'

export interface UploadBarItemProps {
    item: IUploadProgressInfo<SnFile>
    handleSelectItem?: (item: IUploadProgressInfo<SnFile>) => void
}

export class UploadBar extends React.Component<UploadBarItemProps> {

    public render() {
        return (<div>
            {/** ToDo */}
        </div>)
    }
}
