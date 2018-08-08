import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { resources } from '../assets/resources'

const styles = {
    window: {
        left: 14,
        bottom: 14,
    },
    messagebar: {
        background: '#666666',
        padding: '0px 14px',
        fontFamily: 'Raleway Medium',
        fontSize: 15,
    },
    messages: {
        margin: 0,
        WebkitPaddingStart: 0,
    },
    message: {
        listStyleType: 'none',
        padding: 0,
    },
}

interface MessageBarState {
    open: boolean
}

const mapStateToProps = (state: rootStateType) => {
    return {
        messagebar: state.dms.messagebar,
    }
}

const mapDispatchToProps = {
    openMessageBar: DMSActions.openMessageBar,
    closeMessageBar: DMSActions.closeMessageBar,
}

class MessageBar extends React.Component<{ classes } & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, MessageBarState> {
    public closeMessageBar = () => {
        this.props.closeMessageBar()
    }
    public render() {
        const { classes, messagebar } = this.props
        // tslint:disable-next-line:no-string-literal
        const successful = messagebar.content ? messagebar.content['d'] && messagebar.content['d'].results && messagebar.content['d'].results.length > 0 ? messagebar.content['d'].results : messagebar.content['d'] : null
        // tslint:disable-next-line:no-string-literal
        const failed = messagebar.content &&  messagebar.content['d'] ? messagebar.content['d'].errors ? messagebar.content['d'].errors : null : null
        const action = messagebar.event
        let successMessage
        if (successful && successful.length > 0) {
            if (successful.length > 1) {
                successMessage = `${successful.length} ${resources.ITEMS_ARE} ${resources[`${action}_MULTIPLE_MESSAGE`]}`
            } else {
                successMessage = `$successful[0] ? successful[0].Name : successful.DisplayName} ${resources[`${action}_MESSAGE`]}`
            }
        } else {
            successMessage = null
        }
        const failedMessage = failed ? failed.length > 1 ? `${failed.length} ${resources.ITEMS} ${resources[`${action}_FAILED_MESSAGE`]}` : `${failed.DisplayName} ${resources[`${action}_FAILED_MESSAGE`]}` : null
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={messagebar.open}
                autoHideDuration={messagebar.hideDuration}
                onClose={this.closeMessageBar}
                onExited={this.props.messagebar.exited}
                className={classes.window}
                ContentProps={{
                    classes: {
                        root: classes.messagebar,
                    },
                }}
                message={
                    <ul style={styles.messages}>
                        {successMessage && successMessage.length > 0 ? <li style={styles.message}>{successMessage}</li> : null}
                        {failedMessage && failedMessage.length > 0 ? <li style={styles.message}>{failedMessage}</li> : null}
                    </ul>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => this.closeMessageBar()}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageBar))
