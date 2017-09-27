import * as React from 'react'
import {
    withRouter
} from 'react-router-dom'
import * as keycode from 'keycode';
import { connect } from 'react-redux';
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { DMSActions } from '../../Actions'

import Table, {
    TableRow,
    TableCell
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import MoreVert from 'material-ui-icons/MoreVert';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { icons } from '../../assets/icons'
import Moment from 'react-moment';
import TextField from 'material-ui/TextField';

const styles = {
    selectedRow: {

    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'
    },
    checkbox: {
        opacity: 0
    },
    selectedCheckbox: {
        opacity: 1
    },
    hoveredCheckbox: {
        opacity: 1
    },
    typeIcon: {
        width: 30,
        lineHeight: '9px'
    },
    displayName: {
        fontWeight: 'bold'
    },
    hoveredDisplayName: {
        fontWeight: 'bold',
        color: '#03a9f4',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'
    },
    editedTitle: {
        fontWeight: 'normal',
        fontStyle: 'italic'
    },
    icon: {
        verticalAlign: 'middle',
        opacity: 0
    },
    selectedIcon: {
        verticalAlign: 'middle'
    },
    hoveredIcon: {
        verticalAlign: 'middle'
    },
}

interface ISimpleTableRowProps {
    content,
    select: Function,
    deselect: Function,
    getActions: Function,
    opened: Number,
    triggerActionMenu: Function,
    history,
    parentId,
    rootId,
    selected
}

interface ISimpleTableRowState {
    hovered,
    opened,
    actionMenuIsOpen,
    anchorEl,
    clicks,
    edited,
    selected
}

class SimpleTableRow extends React.Component<ISimpleTableRowProps, ISimpleTableRowState>{
    constructor(props) {
        super(props)

        this.state = {
            selected: [],
            hovered: null,
            opened: this.props.opened,
            actionMenuIsOpen: false,
            anchorEl: null,
            clicks: 0,
            edited: {
                id: null,
                oldText: '',
                newText: ''
            }
        }
        this.handleContextMenu = this.handleContextMenu.bind(this)
        this.handleTitleClick = this.handleTitleClick.bind(this)
        this.handleTitleLongClick = this.handleTitleLongClick.bind(this)
        this.handleTitleInputBlur = this.handleTitleInputBlur.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
    }
    componentDidUpdate(){
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
        this.handleRowSingleClick = this.handleRowSingleClick.bind(this)
    }
    handleRowSingleClick(e, id) {
        this.setState({
            edited: {
                id: null,
                oldText: '',
                newText: ''
            }
        })
        this.props.selected.indexOf(id) > -1 ?
            this.props.deselect(id) :
            this.props.select(id)

        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    }
    handleRowDoubleClick(e, id) {
        this.props.history.push(`/${id}`)
    }
    handleTitleClick(e) {
        let that = this;
        that.setState({
            clicks: this.state.clicks + 1
        })
        console.log(this)
        if (that.state.clicks === 1) {
            setTimeout(function () {
                if (that.state.clicks === 1) {
                    //that.handleRowSingleClick(e, id);
                } else {
                    //that.handleTitleLongClick(e, id)
                }
                that.setState({
                    clicks: 0
                })
            }, 1000);
        }
    }
    handleTitleLongClick(e, id) {
        this.setState({
            edited: {
                id: id,
                oldText: e.target.value,
                newText: e.target.value
            }
        })
    }
    handleTitleChange(e, id) {
        this.setState({
            edited: {
                id: id,
                oldText: this.state.edited.oldText,
                newText: e.target.value
            }
        })
    }
    handleTitleInputBlur(e, id) {
        console.log(e.target.value)
    }
    handleContextMenu(e, content) {
        e.preventDefault()
        this.props.getActions(content, 'DMSListItem') && this.props.triggerActionMenu(e.currentTarget)
    }
    handleActionMenuClick(e, content) {
        this.props.triggerActionMenu(e.currentTarget)
        this.props.getActions(content, 'DMSListItem') && this.setState({ anchorEl: e.currentTarget })
    }
    handleActionMenuClose = (e) => {
        this.props.triggerActionMenu(e.currentTarget, false)
    };
    handleKeyDown(e, id) { }
    handleRowMouseEnter(e, id) {
        this.setState({
            hovered: id
        })
    }
    handleRowMouseLeave() {
        this.setState({
            hovered: null
        })
    }
    isSelected(id) { return this.state.selected.indexOf(id) !== -1; }
    isHovered(id) {
        return this.state.hovered === id
    }
    isEdited(id) { return this.state.edited.id === id }
    render() {
        const content = this.props.content;
        const isSelected = this.isSelected(content.Id);
        const isHovered = this.isHovered(content.Id);
        const isEdited = this.isEdited(content.Id);
        return (
            <TableRow
                hover
                onKeyDown={event => this.handleKeyDown(event, content.Id)}
                role='checkbox'
                aria-checked={isSelected}
                tabIndex={-1}
                onMouseEnter={event => this.handleRowMouseEnter(event, content.Id)}
                onMouseLeave={event => this.handleRowMouseLeave()}
                selected={isSelected}
                style={isSelected ? styles.selectedRow : null}
                onContextMenu={event => this.handleContextMenu(event, content)}
            >
                <TableCell
                    checkbox
                    style={styles.checkboxButton}
                    onClick={event => this.handleRowSingleClick(event, content.Id)}
                    onDoubleClick={event => this.handleRowDoubleClick(event, content.Id)}>
                    <div style={
                        isSelected ? styles.selectedCheckbox : styles.checkbox &&
                            isHovered ? styles.hoveredCheckbox : styles.checkbox}>
                        <Checkbox
                            checked={isSelected}
                        />
                    </div>
                </TableCell>
                <TableCell
                    style={styles.typeIcon}
                    disablePadding
                    onClick={event => this.handleRowSingleClick(event, content.Id)}
                    onDoubleClick={event => this.handleRowDoubleClick(event, content.Id)}>
                    <Icon color='primary'>{icons[content.Icon]}</Icon>
                </TableCell>
                <TableCell
                    style={isHovered && !isEdited ? styles.hoveredDisplayName : styles.displayName as any}
                    onClick={event => this.handleTitleClick(event)}
                    onDoubleClick={event => this.handleRowDoubleClick(event, content.Id)}>
                    {isEdited ?
                        <TextField
                            autoFocus
                            defaultValue={content.DisplayName}
                            margin='dense'
                            style={styles.editedTitle as any}
                            onChange={event => this.handleTitleChange(event, content.Id)}
                            onBlur={event => this.handleTitleInputBlur(event, content.Id)} /> :
                        content.DisplayName}
                </TableCell>
                <TableCell
                    onClick={event => this.handleRowSingleClick(event, content.Id)}
                    onDoubleClick={event => this.handleRowDoubleClick(event, content.Id)}>
                    <Moment fromNow>
                        {content.ModificationDate}
                    </Moment>
                </TableCell>
                <TableCell style={styles.actionMenuButton}>
                    <IconButton
                        aria-label='Menu'
                        aria-owns={this.state.actionMenuIsOpen}
                        onClick={event => this.handleActionMenuClick(event, content)}
                    >
                        <MoreVert style={
                            isHovered ? styles.hoveredIcon : styles.icon &&
                                isSelected ? styles.selectedIcon : styles.icon
                        } />
                    </IconButton>
                </TableCell>
            </TableRow>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContent(state.sensenet),
        opened: Reducers.getOpenedContent(state.sensenet.children),
    }
}
export default withRouter(connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
    getActions: Actions.RequestContentActions,
    triggerActionMenu: DMSActions.TriggerActionMenu
})(SimpleTableRow))