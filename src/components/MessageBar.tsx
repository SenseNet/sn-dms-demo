import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import withStyles from '@material-ui/core/styles/withStyles'
import { ExtendedError, isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { resources } from '../assets/resources'

const styles = {
    window: {
        left: 14,
        bottom: 14,
    },
    windowMobile: {
    },
    messagebar: {
        background: '#666666',
        padding: '0px 14px',
        fontFamily: 'Raleway Medium',
        fontSize: 15,
    },
    messagebarMobile: {
        background: '#fff',
        padding: '0px 14px',
        fontFamily: 'Raleway Medium',
        fontSize: 15,
        color: '#000',
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
        let successful
        if (messagebar.content && !isExtendedError(messagebar.content as any)) {
            // tslint:disable-next-line:no-string-literal
            if (messagebar.content['d'] && messagebar.content['d'].results && messagebar.content['d'].results.length > 0) {
                // tslint:disable-next-line:no-string-literal
                successful = messagebar.content['d'].results
            } else if (messagebar.content[0]) {
                successful = messagebar.content[0]
            } else {
                // tslint:disable-next-line:no-string-literal
                successful = messagebar.content['d']
            }
        } else {
            successful = null
        }
        let failed
        // tslint:disable-next-line:no-string-literal
        if (messagebar.content) {
            // tslint:disable-next-line:no-string-literal
            if (messagebar.content['d'] && messagebar.content['d'].errors) {
                // tslint:disable-next-line:no-string-literal
                failed = messagebar.content['d'].errors
            } else if (isExtendedError(messagebar.content as Error)) {
                failed = [(messagebar.content as ExtendedError).message]
            } else if (messagebar.content[0]) {
                failed = messagebar.content
            } else {
                failed = null
            }
        } else {
            // tslint:disable-next-line:no-string-literal
            if (messagebar.content['message'] !== undefined) {
                // tslint:disable-next-line:no-string-literal
                failed = [messagebar.content['message']]
            } else {
                failed = null
            }
        }
        const action = messagebar.event
        let successMessage
        if (successful) {
            if (successful.length > 1) {
                successMessage = `${successful.length} ${resources.ITEMS_ARE} ${resources[`${action}_MULTIPLE_MESSAGE`]}`
            } else {
                successMessage = `${successful[0] ? successful[0].Name : successful.DisplayName} ${resources[`${action}_MESSAGE`]}`
            }
        } else {
            successMessage = null
        }
        let failedMessage
        if (failed) {
            if (failed.length > 1) {
                failedMessage = `${failed.length} ${resources.ITEMS} ${resources[`${action}_FAILED_MESSAGE`]}`
            } else if (failed.length === 1) {
                failedMessage = `${resources.CONTENT} ${failed[0]}`
            }
        } else {
            failedMessage = null
        }
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) =>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={messagebar.open}
                        autoHideDuration={messagebar.hideDuration}
                        onClose={this.closeMessageBar}
                        onExited={this.props.messagebar.exited}
                        className={matches ? classes.window : classes.windowMobile}
                        ContentProps={{
                            classes: {
                                root: matches ? classes.messagebar : classes.messagebarMobile,
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
                                color={matches ? 'inherit' : 'primary'}
                                onClick={() => this.closeMessageBar()}
                            >
                                <Icon type={iconType.materialui} iconName="close"
                                style={{ color: '#fff' }} />
                            </IconButton>,
                        ]}
                    />
                }
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageBar))
