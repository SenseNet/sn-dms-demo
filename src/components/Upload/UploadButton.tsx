import { Button } from '@material-ui/core'
import { FileUpload } from '@material-ui/icons'
import * as React from 'react'
import { v1 } from 'uuid'
import { resources } from '../../assets/resources'

export interface UploadButtonProps {
    uploadPath: string
    accept?: string
    multiple?: boolean
    handleUpload: (ev: Event) => Promise<void>
}

const UPLOAD_BUTTON_ID: string = 'sn-dms-upload-button'

export class UploadButton extends React.Component<UploadButtonProps> {
    private readonly buttonId = `${UPLOAD_BUTTON_ID}-${v1()}`

    private async handleUpload(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.persist()
        await this.props.handleUpload(ev.nativeEvent)
    }

    public render() {
        return (<div>
            <input
                accept={this.props.accept}
                multiple={this.props.multiple}
                id={this.buttonId}
                type="file"
                onChange={(ev) => this.handleUpload(ev)}
            />
            <label htmlFor={this.buttonId}>
                <Button variant="contained" component="span">
                    <FileUpload />
                    ${resources.UPLOAD_BUTTON_TITLE}
                </Button>
            </label>
        </div>)
    }
}
