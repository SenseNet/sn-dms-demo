import { Button, ClickAwayListener, ListItemIcon, Menu, MenuItem, MuiThemeProvider } from '@material-ui/core'
import { FileUpload } from '@material-ui/icons'
import * as React from 'react'
import { v1 } from 'uuid'
import { resources } from '../../assets/resources'

export interface UploadButtonProps {
    uploadPath: string
    accept?: string
    multiple?: boolean
    handleUpload: (ev: React.FormEvent<HTMLElement>) => void
}

export interface UploadButtonState {
    anchorElement: HTMLElement | null
}

const UPLOAD_FILE_BUTTON_ID: string = 'sn-dms-upload-button'
const UPLOAD_FOLDER_BUTTON_ID: string = 'sn-dms-upload-button'
const UPLOAD_MENU_ID: string = 'sn-dms-upload-button'

export class UploadButton extends React.Component<UploadButtonProps, UploadButtonState> {
    private readonly uploadFileButtonId = `${UPLOAD_FILE_BUTTON_ID}-${v1()}`
    private readonly uploadFolderButtonId = `${UPLOAD_FOLDER_BUTTON_ID}-${v1()}`
    private readonly uploadMenuId = `${UPLOAD_MENU_ID}-${v1()}`

    public state: UploadButtonState = {
        anchorElement: null,
    }

    private async handleUpload(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.persist()
        await this.props.handleUpload(ev)
    }

    private toggleOpen(ev: React.MouseEvent<HTMLElement>) {
        this.setState({
            ...this.state,
            anchorElement: this.state.anchorElement ? null : ev.currentTarget,
        })
    }

    private closeMenu() {
        this.setState({
            ...this.state,
            anchorElement: null,
        })
    }

    public render() {
        return (<div>
            <Button
                aria-owns={this.state.anchorElement ? this.uploadMenuId : null}
                aria-haspopup={true}
                variant="contained"
                component="span"
                color="primary"
                style={{
                    color: '#fff',
                }}
                onClick={(ev) => this.toggleOpen(ev)}>
                <FileUpload />
                {resources.UPLOAD_BUTTON_TITLE}
            </Button>
            <Menu
                id={this.uploadMenuId}
                open={Boolean(this.state.anchorElement)}
                anchorEl={this.state.anchorElement}
                getContentAnchorEl={undefined}
                anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'bottom',
                }}
                onBlur={() => this.closeMenu()}
            >
                <MenuItem>
                    <label htmlFor={this.uploadFileButtonId}>
                        <ListItemIcon>
                            <FileUpload />
                        </ListItemIcon>
                        {resources.UPLOAD_BUTTON_UPLOAD_FILE_TITLE}
                    </label>
                </MenuItem>
                <MenuItem>
                    <label htmlFor={this.uploadFolderButtonId}>
                        <ListItemIcon>
                            <FileUpload />
                        </ListItemIcon>
                        {resources.UPLOAD_BUTTON_UPLOAD_FOLDER_TITLE}
                    </label>
                </MenuItem>
            </Menu>
            <div style={{ visibility: 'hidden' }}>
                <input
                    accept={this.props.accept}
                    multiple={this.props.multiple}
                    id={this.uploadFileButtonId}
                    type="file"
                    onChange={(ev) => this.handleUpload(ev)}
                />
                <input
                    accept={this.props.accept}
                    multiple={this.props.multiple}
                    id={this.uploadFolderButtonId}
                    type="file"
                    onChange={(ev) => this.handleUpload(ev)}
                    {...{
                        directory: '',
                        webkitdirectory: '',
                    } as any
                    }
                />
            </div>

            {/* <input
                        style={{ visibility: 'hidden' }}
                        accept={this.props.accept}
                        multiple={this.props.multiple}
                        id={this.buttonId}
                        type="file"
                        onChange={(ev) => this.handleUpload(ev)}
                    />
                    <label htmlFor={this.buttonId}>
                        <Button variant="contained" component="span" color="primary">
                            <FileUpload />
                            {resources.UPLOAD_BUTTON_UPLOAD_FILE_TITLE}
                        </Button>
                    </label> */}
        </div >
        )
    }
}
