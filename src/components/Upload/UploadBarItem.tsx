import { IUploadProgressInfo } from '@sensenet/client-core'
import * as React from 'react'

export interface UploadBarItemProps {
    item: IUploadProgressInfo
    handleSelectItem?: (item: IUploadProgressInfo) => void
}

export class UploadBar extends React.Component<UploadBarItemProps> {

    public render() {
        return (<div>
            {/** ToDo */}
        </div>)
    }
}
