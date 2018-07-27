import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'

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
                message={<ul style={styles.messages}>
                    {messagebar.content.map((result, index) => <li style={styles.message} key={index}>{result}</li>)}
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
