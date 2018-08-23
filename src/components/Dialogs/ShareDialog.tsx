import { Button, Divider, Input, MenuItem, Select, Typography, withStyles } from '@material-ui/core'
import { Link } from '@material-ui/icons'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { versionName } from '../../assets/helpers'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import DialogInfo from './DialogInfo'
import RestoreVersionsDialog from './RestoreVersionDialog'

const styles = {
    buttonContainer: {
        display: 'flex',
        height: 32,
    },
    containerChild: {
        flexGrow: 1,
        display: 'inline-flex',
    },
    rightColumn: {
        textAlign: 'right',
        flexGrow: 1,
        marginLeft: 'auto',
    },
    inner: {
        minWidth: 550,
        fontFamily: 'Raleway Medium',
        fontSize: 14,
        margin: '20px 0',
    },
    uploadVersionButton: {
        marginRight: 20,
        backgroundColor: '#016d9e',
        color: '#fff',
    },
    actionButton: {
        margin: '0 15px',
    },
    link: {
        color: '#016D9E',
        fontSize: '13px',
        fontFamily: 'Raleway Semibold',
        textDecoration: 'none',
        cursor: 'pointer',
    },
}

interface ShareDialogProps extends RouteComponentProps<any> {
    currentContent: GenericContent,
    closeCallback?: () => void
}

const mapStateToProps = (state: rootStateType, props: ShareDialogProps) => {
    return {
        //
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    openDialog: DMSActions.openDialog,
}

type addType = 'see' | 'edit'

type linkSharingType = addType | 'off'

interface ShareDialogState {
    addType: addType
    addValue: string
    sharedWithValues: Array<{ value: string, type: addType }>
    linkSharingType: linkSharingType
}

class ShareDialog extends React.Component<{ classes } & ShareDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, ShareDialogState> {
    public state: ShareDialogState = {
        addType: 'see',
        addValue: '',
        linkSharingType: 'off',
        sharedWithValues: [],
    }
    constructor(props: ShareDialog['props']) {
        super(props)
        this.handleCancel = this.handleCancel.bind(this)
        this.submitCallback = this.submitCallback.bind(this)
        this.handleAddTypeChange = this.handleAddTypeChange.bind(this)
        this.handleAddValueChange = this.handleAddValueChange.bind(this)
        this.handleAddEntry = this.handleAddEntry.bind(this)
        this.copyUrl = this.copyUrl.bind(this)
    }
    public static getDerivedStateFromProps(newProps: ShareDialog['props'], lastState: ShareDialogState) {
        const icon = newProps.currentContent.Icon && icons[newProps.currentContent.Icon.toLowerCase() as any]
        return {
            icon,
        }
    }

    public handleCancel = () => {
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public submitCallback = () => {
        this.props.closeDialog()
        this.props.closeCallback()
    }

    public handleAddTypeChange(ev: React.ChangeEvent) {
        this.setState({
            addType: (ev.target as any).value,
        })
    }

    public handleAddValueChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            addValue: ev.currentTarget.value,
        })
    }

    public formatVersionNumber = (version: string) => {
        const v = resources[`VERSION_${versionName(version.slice(-1))}`]
        return `${version.substring(0, version.length - 2)} ${v}`
    }
    public handleRestoreButtonClick = (id: number, version: string, name: string) => {
        this.props.closeDialog()
        this.props.openDialog(<RestoreVersionsDialog id={id} version={version} fileName={name} />)
    }

    public handleAddEntry(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault()
        ev.currentTarget.reset()
        this.setState({
            addValue: '',
            sharedWithValues: [
                ...this.state.sharedWithValues.filter((val) => val.value !== this.state.addValue),
                { type: this.state.addType, value: this.state.addValue },
            ],
        })
    }

    private getLinkSharingTypePostfix() {
        switch (this.state.linkSharingType) {
            case 'off':
                return <span>{resources.SHARE_LINK_POSTFIX_OFF}</span>
            case 'see':
                return <span>{resources.SHARE_LINK_POSTFIX_VIEW}</span>
            case 'edit':
                return <span>{resources.SHARE_LINK_POSTFIX_EDIT}</span>
        }
    }

    private copyUrl() {
        const newUrl = new URL(window.location.origin)
        newUrl.hash = PathHelper.joinPaths('preview', btoa(this.props.currentContent.Id.toString()));
        (navigator as any).clipboard.writeText(newUrl.toString()).then(() => {
            /** Link copied */
        })
    }

    public render() {
        const { currentContent } = this.props
        return (
            <div>
                <Typography variant="headline" gutterBottom>
                    {resources.SHARE}
                </Typography>
                <div style={styles.inner}>
                    <DialogInfo currentContent={currentContent} hideVersionInfo={true} />
                    <Divider />
                    <form style={{ display: 'flex', margin: '10px 0' }} onSubmit={this.handleAddEntry}>
                        <Input
                            defaultValue={this.state.addValue}
                            style={{ flexGrow: 1 }}
                            type="text"
                            required
                            onChange={this.handleAddValueChange}
                            placeholder={resources.SHARE_EMAIL_INPUT_PLACEHOLDER} />
                        <Select
                            onChange={this.handleAddTypeChange}
                            value={this.state.addType}
                            inputProps={{
                                name: 'addType',
                            }}>
                            <MenuItem value="see">{resources.SHARE_PERMISSION_VIEW}</MenuItem>
                            <MenuItem value="edit">{resources.SHARE_PERMISSION_EDIT}</MenuItem>
                        </Select>
                    </form>
                    {this.state.sharedWithValues.length ?
                        <Typography variant="body2" style={{ fontSize: '.85em' }}>
                            <strong>{resources.SHARED_WITH} </strong>
                            {this.state.sharedWithValues.map((v) => v.value).join(', ')}
                            <Divider />
                        </Typography>
                        : null}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span>{resources.SHARE_LINK_PREFIX}</span>&nbsp;
                            <strong>{this.getLinkSharingTypePostfix()}</strong>
                        </div>
                        <Button style={styles.link} onClick={this.copyUrl}>
                            <Link /> &nbsp;
                            {resources.SHARE_COPY_LINK}
                        </Button>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button style={styles.link} >
                        {resources.MORE_SHARE_OPTIONS}
                    </Button>
                    <div>
                        <Button style={styles.actionButton} onClick={this.handleCancel}>{resources.CANCEL}</Button>
                        <Button style={styles.actionButton} variant="contained" color="secondary" onClick={this.handleCancel}>{resources.OK}</Button>
                    </div>
                </div>

            </div >
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(ShareDialog)))
