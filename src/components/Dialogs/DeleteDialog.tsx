import { Typography, withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
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

interface DeleteDialogProps {
    selected: number[],
    permanent?: boolean,
}

interface DeleteDialogState {
    checked: boolean,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        currentitems: state.sensenet.currentitems.entities,
        closeCallback: state.dms.dialog.onClose,
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    deleteContent: Actions.deleteBatch,
}

class DeleteDialog extends React.Component<{ classes } & DeleteDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DeleteDialogState> {
    public state = {
        checked: this.props.permanent === null || !this.props.permanent ? false : true,
    }
    public handleCheckboxClick = () => {
        this.setState({
            checked: !this.state.checked,
        })
    }
    public handleCancel = () => {
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public submitCallback = () => {
        const permanently = this.state.checked ? true : false
        this.props.deleteContent(this.props.selected, permanently)
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public render() {
        const { classes, currentitems, selected } = this.props
        return (
            <div>
                <Typography variant="headline" gutterBottom>
                    {resources.DELETE}
                </Typography>
                <div style={styles.inner}>
                    <div style={{ opacity: .54 }}>{resources.ARE_YOU_SURE_YOU_WANT_TO_DELETE}</div>
                    <ul style={styles.list}>
                        {selected.map((id) => <li
                            key={id}
                            style={styles.listItem}>
                            {currentitems.map((item) => id === item.Id ? item.DisplayName : null)}
                        </li>,
                        )}
                    </ul>
                </div>
                <div style={styles.buttonContainer}>
                    <div style={styles.containerChild}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.checked}
                                    onChange={() => this.handleCheckboxClick()}
                                    value="checked"
                                    color="primary"
                                />
                            }
                            label={<span className={classes.label}>{resources.DELETE_PERMANENTLY}</span>}
                        />
                    </div>
                    <div style={styles.rightColumn as any}>
                        <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>{resources.CANCEL}</Button>
                        <Button onClick={() => this.submitCallback()} variant="raised" color="secondary" style={styles.deleteButton}>{resources.DELETE}</Button>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(DeleteDialog))
