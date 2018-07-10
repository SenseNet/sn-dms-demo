import Icon from '@material-ui/core/Icon'
import TableCell from '@material-ui/core/TableCell'
import TextField from '@material-ui/core/TextField'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { DropTarget } from 'react-dnd'
import { DragSource } from 'react-dnd'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../../Actions'
import { icons } from '../../../assets/icons'
import * as DragAndDrop from '../../../DragAndDrop'
import * as DMSReducers from '../../../Reducers'

const styles = {
    displayName: {
        fontSize: 16,
        fontFamily: 'Raleway Medium',
        fontWeight: 'normal',
    },
    hoveredDisplayName: {
        fontFamily: 'Raleway Semibold',
        cursor: 'pointer' as any,
        fontSize: 16,
        fontWeight: 'normal',
    },
    displayNameDiv: {
        width: '100%',
        display: 'flex',
        position: 'relative',
        boxSizing: 'border-box',
        textAlign: 'left',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textDecoration: 'none',
        fontWeight: 'normal',
    },
    selectedDisplayNameDiv: {
        color: '#016D9E',
        fontFamily: 'Raleway Semibold',
        fontWeight: 'normal',
    },
    editedTitle: {
        fontWeight: 'normal' as any,
        fontStyle: 'italic' as any,
    },
    icon: {
        verticalAlign: 'middle',
        flexShrink: 0,
        width: '1em',
        height: '1em',
        display: 'inline-block',
        fontSize: 30,
    },
    title: {
            flex: '1 1 auto',
            padding: '0 16px',
            minWidth: 0,
        },
}

interface DisplayNameCellProps {
    content,
    isHovered: boolean,
    handleRowDoubleClick,
    handleRowSingleClick,
    rename,
    setEdited,
    currentContent,
    edited,
    connectDragSource,
    connectDropTarget,
    isDragging: boolean,
    isOver: boolean,
    canDrop: boolean,
    onDrop,
    moveCard,
    isCopy: boolean,
    selected,
    selectedContentItems,
    copyBatch,
    moveBatch,
    editedFirst: boolean,
    setEditedFirst,
    icon,
    isSelected
}

interface DisplayNameCellState {
    oldText,
    newText,
    edited,
    displayName
}

@DropTarget('row', DragAndDrop.rowTarget, (conn, monitor) => ({
    connectDropTarget: conn.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
@DragSource('row', DragAndDrop.rowSource, DragAndDrop.collect)
class DisplayNameCell extends React.Component<DisplayNameCellProps, DisplayNameCellState> {
    private input: HTMLInputElement
    constructor(props) {
        super(props)

        this.state = {
            oldText: this.props.content.DisplayName,
            newText: '',
            edited: this.props.edited,
            displayName: this.props.content.DisplayName,
        }

        this.handleTitleClick = this.handleTitleClick.bind(this)
        this.handleTitleInputBlur = this.handleTitleInputBlur.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
    }
    public handleTitleClick(e, id) {
        if (e.target.id !== 'renameInput') {
            e.preventDefault()
        }
    }
    public handleTitleChange(e) {
        this.setState({
            newText: e.target.value,
        })
    }
    public handleTitleInputBlur(id, mobile) {
        if (!mobile) {
            if (this.state.newText !== '' && this.state.oldText !== this.state.newText) {
                this.updateDisplayName()
            } else {
                this.setState({
                    edited: null,
                    newText: '',
                })
                this.props.setEdited(null)
            }
        } else {
            if (this.props.editedFirst) {
                this.input.focus()
                this.props.setEditedFirst(false)
            } else {
                if (this.state.newText !== '' && this.state.oldText !== this.state.newText) {
                    this.updateDisplayName()
                } else {
                    this.setState({
                        edited: null,
                        newText: '',
                    })
                    this.props.setEdited(null)
                }
            }
        }
    }
    public handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.updateDisplayName()
        }
    }
    public updateDisplayName() {
        const c = this.props.currentContent
        const updateableContent = c
        updateableContent.DisplayName = this.state.newText
        this.props.rename(updateableContent.Id, updateableContent)
        this.setState({
            edited: null,
            newText: '',
            displayName: this.state.newText,
        })
        this.props.setEdited(null)
    }
    public isEdited(id) { return this.props.edited === id }
    public render() {
        const content = this.props.currentContent
        const isEdited = this.isEdited(this.props.content.Id)
        const selected = this.props.selected
        const { handleRowSingleClick, handleRowDoubleClick, connectDragSource, connectDropTarget, isCopy, icon, isSelected } = this.props
        const dropEffect = isCopy ? 'copy' : 'move'
        const iconColor = icon.toLowerCase() !== 'folder' || isSelected ? 'primary' : 'disabled'
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <TableCell
                        padding="none"
                        style={this.props.isHovered && !isEdited ? styles.hoveredDisplayName : styles.displayName as any}
                        onClick={(event) => handleRowSingleClick(event, content.id)}
                        onDoubleClick={(event) => handleRowDoubleClick(event, this.props.content.Id)}>
                        {isEdited ?
                            <div>
                                <Icon color="primary" style={styles.icon}>{icons[icon.toLowerCase()]}</Icon>
                                <TextField
                                    id="renameInput"
                                    autoFocus={isEdited}
                                    defaultValue={this.props.content.DisplayName}
                                    margin="dense"
                                    style={styles.editedTitle as any}
                                    onChange={(event) => this.handleTitleChange(event)}
                                    onKeyPress={(event) => this.handleKeyPress(event)}
                                    onBlur={(event) => this.handleTitleInputBlur(this.props.content.Id, !matches)}
                                    inputRef={(ref) => this.input = ref}
                                />
                            </div> :
                            connectDragSource(connectDropTarget(<div
                                onClick={(event) => matches ? this.handleTitleClick(event, this.props.content.Id) : event.preventDefault()}
                                style={isSelected ? {...styles.selectedDisplayNameDiv, ...styles.displayNameDiv} : styles.displayNameDiv as any}>
                                <Icon color={iconColor} style={styles.icon}>{icons[icon.toLowerCase()]}</Icon>
                                <div style={styles.title}>{this.state.displayName}</div>
                            </div>), { dropEffect })
                        }
                    </TableCell>
                }}
            </MediaQuery>
        )
    }
}

const renameContent = Actions.updateContent
const setEdited = DMSActions.setEditedContentId

const mapStateToProps = (state, match) => {
    return {
        currentContent: Reducers.getContent(state.sensenet.children.entities, match.content.Id),
        edited: DMSReducers.getEditedItemId(state.dms),
        selected: Reducers.getSelectedContentIds(state.sensenet),
        selectedContentItems: Reducers.getSelectedContentItems(state.sensenet),
        editedFirst: DMSReducers.isEditedFirst(state.dms),
    }
}

export default connect(mapStateToProps, {
    rename: renameContent,
    setEdited,
    copyBatch: Actions.copyBatch,
    moveBatch: Actions.moveBatch,
    setEditedFirst: DMSActions.setEditedFirst,
})(DisplayNameCell)
