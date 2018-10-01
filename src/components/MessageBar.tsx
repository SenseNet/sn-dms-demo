import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import withStyles from '@material-ui/core/styles/withStyles'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '..'
import { LogEntry, readLogEntries } from '../store/actionlog/actions'

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
    visibleEntries: LogEntry[]
    open: boolean
}

const mapStateToProps = (state: rootStateType) => {
    return {
        entries: state.dms.log.entries,
    }
}

const mapDispatchToProps = {
    read: readLogEntries,
}

class MessageBar extends React.Component<{ classes } & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, MessageBarState> {
    public closeMessageBar = () => {
        this.props.read(this.state.visibleEntries)
    }

    public getDerivedStateFromProps(newProps: MessageBar['props'], lastState: MessageBar['state']) {
        const visibleEntries = newProps.entries.filter((e) => e.unread)
        return {
            open: visibleEntries.length > 0,
            visibleEntries,
        } as MessageBar['state']
    }

    public render() {
        const { classes } = this.props

        // let message!: JSX.Element

        // if (typeof messagebar.content === 'string') {
        //     /** */
        //     message = <span>{messagebar.content}</span>
        // } else if (isExtendedError(messagebar.content as Error)) {
        //     const extendedError = messagebar.content as ExtendedError
        //     message = <span>{extendedError.body.message.value || extendedError.message}</span>
        // }

        // let successful
        // if (messagebar.content && !isExtendedError(messagebar.content as any)) {
        //     if (messagebar.content.d && messagebar.content.d.results && messagebar.content.d.results.length > 0) {
        //         successful = messagebar.content.d.results
        //     } else if (messagebar.content[0]) {
        //         successful = messagebar.content[0]
        //     } else {
        //         successful = messagebar.content.d
        //     }
        // } else {
        //     successful = null
        // }
        // let failed
        // if (messagebar.content) {
        //     if (messagebar.content.d && messagebar.content.d.errors) {
        //         failed = messagebar.content.d.errors
        //     } else if (isExtendedError(messagebar.content as Error)) {
        //         failed = [(messagebar.content as ExtendedError).message]
        //     } else if (messagebar.content[0]) {
        //         failed = messagebar.content
        //     } else {
        //         failed = null
        //     }
        // } else {
        //     if (messagebar.content.message !== undefined) {
        //         failed = [messagebar.content.message]
        //     } else {
        //         failed = null
        //     }
        // }
        // const action = messagebar.event
        // let successMessage
        // if (successful) {
        //     if (successful.length > 1) {
        //         successMessage = `${successful.length} ${resources.ITEMS_ARE} ${resources[`${action}_MULTIPLE_MESSAGE`]}`
        //     } else {
        //         successMessage = `${successful[0] ? successful[0].Name : successful.DisplayName} ${resources[`${action}_MESSAGE`]}`
        //     }
        // } else {
        //     successMessage = null
        // }
        // let failedMessage
        // if (failed) {
        //     if (failed.length > 1) {
        //         failedMessage = `${failed.length} ${resources.ITEMS} ${resources[`${action}_FAILED_MESSAGE`]}`
        //     } else if (failed.length === 1) {
        //         failedMessage = `${resources.CONTENT} ${failed[0]}`
        //     }
        // } else {
        //     failedMessage = null
        // }
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) =>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.open}
                        // autoHideDuration={messagebar.hideDuration}
                        onClose={this.closeMessageBar}
                        //  onExited={this.props.messagebar.exited}
                        className={matches ? classes.window : classes.windowMobile}
                        ContentProps={{
                            classes: {
                                root: matches ? classes.messagebar : classes.messagebarMobile,
                            },
                        }}
                        message={
                            <ul style={styles.messages}>
                                {this.state.visibleEntries.map((e) =>
                                    <li>e</li>,
                                )}
                            </ul>
                            // <ul style={styles.messages}>
                            //     {successMessage && successMessage.length > 0 ? <li style={styles.message}>{successMessage}</li> : null}
                            //     {failedMessage && failedMessage.length > 0 ? <li style={styles.message}>{failedMessage}</li> : null}
                            // </ul>
                            }
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
