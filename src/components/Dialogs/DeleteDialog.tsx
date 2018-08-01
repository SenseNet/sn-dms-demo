import { Typography } from '@material-ui/core'
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
}

interface DeleteDialogProps {
    selected: number[],
}

interface DeleteDialogState {
    checked: boolean,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        currentitems: state.sensenet.currentitems.entities,
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    deleteContent: Actions.deleteBatch,
}

class AddNewDialog extends React.Component<DeleteDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DeleteDialogState> {
    public state = {
        checked: false,
    }
    public handleCheckboxClick = () => {
        this.setState({
            checked: !this.state.checked,
        })
    }
    public handleCancel = () => {
        this.props.closeDialog()
    }
    public submitCallback = () => {
        this.props.closeDialog()
        // this.props.deleteBatch(this.props.selected, false)
    }
    public render() {
        const { currentitems, selected } = this.props
        return (
            <div>
                <Typography variant="headline" gutterBottom>
                    {resources.DELETE}
                </Typography>
                <div style={styles.inner}>
                    <div>{resources.ARE_YOU_SURE_YOU_WANT_TO_DELETE}</div>
                    <ul>
                        {selected.map((id) => <li key={id}>{currentitems.map((item) => id === item.Id ? item.DisplayName : null)}</li>)}
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
                            label={resources.DELETE_PERMANENTLY}
                        />
                    </div>
                    <div style={styles.rightColumn as any}>
                        <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>{resources.CANCEL}</Button>
                        <Button type="submit" variant="raised" color="secondary" style={styles.deleteButton}>{resources.DELETE_PERMANENTLY}</Button>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewDialog)
