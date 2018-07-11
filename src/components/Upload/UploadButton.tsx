import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core'
import { FileUpload, Folder, Forward, InsertDriveFile } from '@material-ui/icons'
import * as React from 'react'
import { v1 } from 'uuid'
import { resources } from '../../assets/resources'
import theme from '../../assets/theme'

const styles = {
    menuItem: {
        padding: '6px 15px',
        display: 'flex',
        lineHeight: 1,
        minWidth: 145,
    },
    icon: {
        flexShrink: 0,
        marginRight: 14,
    },
    text: {
        padding: 0,
        fontSize: '0.9rem',
        fontWeight: 'bold' as any,
    },
}

export interface UploadButtonProps {
    accept?: string
    multiple?: boolean
    handleUpload: (files: FileList) => void
    style: React.CSSProperties
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
        await this.props.handleUpload(ev.target.files)
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
        return (<div style={this.props.style}>
            <Button
                aria-owns={this.state.anchorElement ? this.uploadMenuId : null}
                aria-haspopup={true}
                variant="contained"
                component="span"
                color="primary"
                style={{
                    color: '#fff',
                    width: '100%',
                    fontFamily: 'Raleway Bold',
                    textTransform: 'none',
                    fontSize: '14px',
                    paddingTop: 6,
                    paddingBottom: 6,
                    letterSpacing: 1,
                }}
                onClick={(ev) => this.toggleOpen(ev)}>
                <FileUpload style={{ fontSize: 20, marginRight: 5 }} />
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
                style={{
                    width: '100%',
                }}
                onBlur={() => this.closeMenu()}
            >
                <label htmlFor={this.uploadFileButtonId} style={{ outline: 'none' }}>
                    <MenuItem style={styles.menuItem}>
                        <ListItemIcon style={styles.icon}>
                            <div>
                                <InsertDriveFile style={{ color: theme.palette.primary.main }} />
                                <Forward style={{ position: 'absolute', left: '0.86em', top: '0.28em', width: '0.5em', color: 'white', transform: 'rotate(-90deg)' }} />
                            </div>
                        </ListItemIcon>
                        <ListItemText style={styles.text} primary={resources.UPLOAD_BUTTON_UPLOAD_FILE_TITLE} disableTypography />
                    </MenuItem>
                </label>
                <label htmlFor={this.uploadFolderButtonId} tabIndex={-1} style={{ outline: 'none' }}>
                    <MenuItem style={styles.menuItem}>
                        <ListItemIcon style={styles.icon}>
                            <div>
                                <Folder style={{ color: theme.palette.primary.main }} />
                                <Forward style={{ position: 'absolute', left: '0.87em', top: '0.22em', width: '0.5em', color: 'white', transform: 'rotate(-90deg)' }} />
                            </div>
                        </ListItemIcon>
                        <ListItemText style={styles.text} primary={resources.UPLOAD_BUTTON_UPLOAD_FOLDER_TITLE} disableTypography />
                    </MenuItem>
                </label>
            </Menu>
            {!Boolean(this.state.anchorElement) ?
                <div style={{ visibility: 'hidden', display: 'none' }}>
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
                : null}
        </div >
        )
    }
}
