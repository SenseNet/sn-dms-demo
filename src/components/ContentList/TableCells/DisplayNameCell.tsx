import * as React from 'react'
import { connect } from 'react-redux'
import { Content } from 'sn-client-js'
import { Actions, Reducers } from 'sn-redux'
import MediaQuery from 'react-responsive';
import { DMSReducers } from '../../../Reducers'
import { DMSActions } from '../../../Actions'
import { TableCell } from 'material-ui/Table';
import TextField from 'material-ui/TextField';

const styles = {
    displayName: {
        fontWeight: 'bold'
    },
    hoveredDisplayName: {
        fontWeight: 'bold',
        color: '#03a9f4',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    editedTitle: {
        fontWeight: 'normal',
        fontStyle: 'italic'
    },
}

interface IDisplayNameCellProps {
    content: Content,
    isHovered: boolean,
    handleRowDoubleClick: Function,
    handleRowSingleClick: Function,
    rename: Function,
    setEdited: Function,
    currentContent,
    edited
}

interface IDisplayNameCellState {
    oldText,
    newText,
    edited
}

class DisplayNameCell extends React.Component<IDisplayNameCellProps, IDisplayNameCellState>{
    constructor(props) {
        super(props)

        this.state = {
            oldText: this.props.content.DisplayName,
            newText: '',
            edited: this.props.edited
        }

        this.handleTitleClick = this.handleTitleClick.bind(this)
        this.handleTitleLongClick = this.handleTitleLongClick.bind(this)
        this.handleTitleInputBlur = this.handleTitleInputBlur.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
    }
    handleTitleClick(e, id) {
        let that = this;
        if (e.target.id !== 'renameInput') {
            e.preventDefault()
            that.handleTitleLongClick(e, id)
        }
    }
    handleTitleLongClick(e, id) {
        this.setState({
            edited: id
        })
        this.props.setEdited(id)
    }
    handleTitleChange(e) {
        this.setState({
            newText: e.target.value
        })
    }
    handleTitleInputBlur(id) {
        console.log(this.state.oldText)
        console.log(this.state.newText)
        if (this.state.newText !== '' && this.state.oldText !== this.state.newText) {
            this.updateDisplayName()
        }
        else
            this.setState({
                edited: null,
                newText: ''
            })
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.updateDisplayName()
        }
    }
    updateDisplayName() {
        let c = this.props.currentContent;
        let updateableContent = c.repository.HandleLoadedContent(c, c._type)
        updateableContent.DisplayName = this.state.newText
        this.props.rename(updateableContent)
        this.setState({
            edited: null,
            newText: ''
        })
    }
    isEdited(id) { return this.props.edited === id }
    render() {
        const content = this.props.currentContent
        const isEdited = this.isEdited(this.props.content.Id);
        const { handleRowSingleClick, handleRowDoubleClick} = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <TableCell
                        style={this.props.isHovered && !isEdited ? styles.hoveredDisplayName : styles.displayName as any}
                        onClick={event => handleRowSingleClick(event, content.id)}
                        onDoubleClick={event => handleRowDoubleClick(event, this.props.content.Id)}>
                        {isEdited ?
                            <TextField
                                id='renameInput'
                                autoFocus
                                defaultValue={this.props.content.DisplayName}
                                margin='dense'
                                style={styles.editedTitle as any}
                                onChange={event => this.handleTitleChange(event)}
                                onKeyPress={event => this.handleKeyPress(event)}
                                onBlur={event => this.handleTitleInputBlur(this.props.content.Id)} /> :
                            <span onClick={event => matches ? this.handleTitleClick(event, this.props.content.Id) : event.preventDefault()}>{this.props.content.DisplayName}</span>
                        }
                    </TableCell>
                }}
            </MediaQuery>
        )
    }
}

const renameContent = Actions.UpdateContent
const setEdited = DMSActions.SetEditedContentId

const mapStateToProps = (state, match) => {
    return {
        currentContent: Reducers.getContent(state.sensenet.children.entities, match.content.Id),
        edited: DMSReducers.getEditedItemId(state.dms),
    }
}

export default connect(mapStateToProps, {
    rename: renameContent,
    setEdited: setEdited
})(DisplayNameCell)