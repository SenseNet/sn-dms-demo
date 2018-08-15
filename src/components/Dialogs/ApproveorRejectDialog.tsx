import { Typography, withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'

const styles = {
    buttonContainer: {
        display: 'flex',
        height: 32,
    },
    containerChild: {
        flexGrow: 1,
        display: 'inline-flex',
        opacity: .54,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: '6px 10px',
    },
    inner: {
        minWidth: 550,
        fontFamily: 'Raleway Medium',
        fontSize: 14,
        margin: '20px 0',
    },
    rightColumn: {
        textAlign: 'right',
        flexGrow: 1,
        marginLeft: 'auto',
    },
    listItem: {
        listStyleType: 'none',
        lineHeight: '25px',
    },
    list: {
        margin: '10px 0 0',
        padding: 0,
    },
    label: {
        fontSize: 14,
    },
}

interface ApproveorRejectDialogProps {
    id: number,
    fileName: string,
}

interface ApproveorRejectDialogState {
    isRejected: boolean,
    rejectReason: string,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        closeCallback: state.dms.dialog.onClose,
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    approveContent: Actions.approve,
    rejectContent: Actions.rejectContent,
}

class RestoreVersionDialog extends React.Component<{ classes } & ApproveorRejectDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, ApproveorRejectDialogState> {
    public state: ApproveorRejectDialogState = {
        isRejected: false,
        rejectReason: '',
    }
    public handleCancel = () => {
        this.props.closeDialog()
    }
    public approveCallback = () => {
        const { closeDialog, id, approveContent } = this.props
        closeDialog()
        approveContent(id)
    }
    public rejectCallback = () => {
        const { closeDialog, id, rejectContent } = this.props
        const { isRejected, rejectReason } = this.state
        isRejected ?
            closeDialog() &&
            rejectContent(id, rejectReason)
        : this.setState({
            isRejected: true,
        })
    }
    public handleChange = (e) => {
        this.setState({
            rejectReason: e.target.value,
        })
    }
    public render() {
        const { fileName } = this.props
        const { isRejected } = this.state
        return (
            <div>
                <Typography variant="headline" gutterBottom>
                    {resources.APPROVE_OR_REJECT}
                </Typography>
                <div style={styles.inner}>
                    <div>
                        {resources.YOU_ARE_ABOUT_TO_APPROVE_OR_REJECT}
                        <strong style={{ fontFamily: 'Raleway Semibold' }}> {fileName}</strong>?
                    </div>
                </div>
                <Fade in={isRejected}>
                    <TextField
                        label={resources.REJECT_REASON_PLACEHOLDER}
                        multiline
                        rowsMax="4"
                        value={this.state.rejectReason}
                        onChange={(e) => this.handleChange(e)}
                        margin="normal"
                        fullWidth
                        style={{ marginBottom: 30, marginTop: 0 }}
                    />
                </Fade>
                <div style={styles.buttonContainer}>
                    <div style={styles.rightColumn as any}>
                        <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>{resources.CANCEL}</Button>
                        <Button onClick={() => this.approveCallback()} variant="raised" color="secondary" style={{ marginRight: 20 }}>{resources.APPROVE}</Button>
                        <Button onClick={() => this.rejectCallback()} variant="contained" color="primary">{resources.REJECT}</Button>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(RestoreVersionDialog))
