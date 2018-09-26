import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'

const styles = {
    inner: {
        minWidth: 550,
        fontFamily: 'Raleway Medium',
        fontSize: 14,
        margin: '20px 0',
    },
    innerMobile: {
        fontFamily: 'Raleway Medium',
        fontSize: 14,
        margin: '20px 0',
    },
    longList: {
        maxHeight: 300,
        overflowY: 'auto',
        padding: 5,
    },
    normalList: {},
    listItem: {
        listStyleType: 'none',
        lineHeight: '25px',
        wordWrap: 'break-word',
    },
    list: {
        margin: '10px 0 0',
        padding: 0,
    },
    buttonContainer: {
        display: 'flex',
        height: 32,
    },
    rightColumn: {
        textAlign: 'right',
        flexGrow: 1,
        marginLeft: 'auto',
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        selected: state.dms.documentLibrary.selected,
        closeCallback: state.dms.picker.pickerOnClose,
        target: state.dms.picker.selected,
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    copyContent: Actions.copyBatch,
}

class CopyToConfirmDialog extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleCancel = () => {
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public submitCallback = () => {
        this.props.copyContent(this.props.selected.map((item) => item.Id), this.props.target[0].Path)
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public render() {
        return (
            <MediaQuery minDeviceWidth={700}>{(matches) =>
                <div>
                    <Typography variant="headline" gutterBottom>
                        {resources.COPY}
                    </Typography>
                    <div style={matches ? styles.inner : styles.innerMobile}>
                        <div style={{ opacity: .54 }}>{resources.ARE_YOU_SURE_YOU_WANT_TO_COPY}</div>
                        <div style={this.props.selected.length > 3 ? styles.longList : styles.normalList}>
                            <ul style={styles.list}>
                                {this.props.selected.map((content) => <li
                                    key={content.Id}
                                    style={styles.listItem as any}>
                                    {content.DisplayName}
                                </li>,
                                )}
                            </ul>
                        </div>
                        <div style={{ opacity: .54, margin: '10px 0' }}>{resources.TO}</div>
                        <div style={{ wordWrap: 'break-word' }}>{this.props.target[0].Path}</div>
                    </div>
                    <div style={styles.buttonContainer}>
                        <div style={styles.rightColumn as any}>
                            { matches ? <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>{resources.CANCEL}</Button> : null }
                            <Button onClick={() => this.submitCallback()} variant="raised" color="secondary">{resources.COPY}</Button>
                        </div>
                    </div>
                </div >
            }</MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyToConfirmDialog)
