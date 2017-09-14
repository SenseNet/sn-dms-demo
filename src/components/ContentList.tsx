
import * as React from 'react'
import * as keycode from 'keycode';
import { connect } from 'react-redux';
import { Actions, Reducers } from 'sn-redux'
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import MenuIcon from 'material-ui-icons/MoreVert';
import Icon from 'material-ui/Icon';
import { icons } from '../assets/icons'
import Moment from 'react-moment';
import { ListHead } from './ListHead'
import { SharedItemsTableRow } from './SharedItemsTableRow'
import { ParentFolderTableRow } from './ParentFolderTableRow'

const styles = {
    selectedRow: {
        
    },
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'
    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'
    },
    typeIcon: {
        width: 30,
        lineHeight: '9px'
    },
    loader: {
        margin: '0 auto'
    },
    displayName: {
        fontWeight: 'bold'
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
    table: {
        background: '#fff'
    },
    checkbox: {
        opacity: 0
    },
    selectedCheckbox: {

    },
    hoveredCheckbox: {
        
    }
}

interface TodoListProps {
    ids,
    children,
    currentId,
    select: Function,
    deselect: Function,
    selected: Number[]
}

class ContentList extends React.Component<TodoListProps, { selected, order, orderBy, data, hovered }> {
    constructor(props) {
        super(props)
        this.state = {
            selected: [],
            order: 'desc',
            orderBy: 'IsFolder',
            data: this.props.children,
            hovered: null
        };

        this.isSelected = this.isSelected.bind(this);
        this.isHovered = this.isHovered.bind(this)
    }
    handleClick(e, id) { 
        this.props.selected.indexOf(id) > -1 ?
        this.props.deselect(id) :
        this.props.select(id)

        this.setState({ selected: this.props.selected });
    }
    handleKeyDown(e, id) { }
    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        const data = this.state.data.sort(
            (a, b) => (order === 'desc' ? b[orderBy] > a[orderBy] : a[orderBy] > b[orderBy]),
        );

        this.setState({ data, order, orderBy });
    };
    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.state.data.map(n => n.id) });
            return;
        }
        this.setState({ selected: [] });
    };
    handleMouseEnter(e, id) {
        this.setState({
            hovered: id
        })
    }
    handleMouseLeave() {
        this.setState({
            hovered: null
        })
    }
    isSelected(id) { return this.state.selected.indexOf(id) !== -1; }
    isHovered(id) {
        return this.state.hovered === id
    }
    render() {
        return (<Table>
            <ListHead
                numSelected={this.state.selected.length}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
            />
            <TableBody style={styles.table}>
                {this.props.currentId && this.props.currentId.length > 0 ?
                    <ParentFolderTableRow currentId={this.props.currentId} /> :
                    <SharedItemsTableRow currentId={this.props.currentId} />
                }

                {this.props.ids.map(n => {
                    //TODO: selection, action, reducer, meg minden
                    let content = this.props.children[n];
                    const isSelected = this.isSelected(content.Id);
                    const isHovered = this.isHovered(content.Id);
                    return (
                        <TableRow
                            hover
                            onClick={event => this.handleClick(event, content.Id)}
                            onKeyDown={event => this.handleKeyDown(event, content.Id)}
                            role='checkbox'
                            aria-checked={isSelected}
                            tabIndex='-1'
                            key={content.Id}
                            onMouseEnter={event => this.handleMouseEnter(event, content.Id)}
                            onMouseLeave={event => this.handleMouseLeave()}
                            selected={isSelected}
                            style={isSelected ? styles.selectedRow : null}
                        >
                            <TableCell checkbox style={styles.checkboxButton}>
                                <Checkbox
                                    checked={isSelected}
                                    style={
                                        isSelected ? styles.selectedCheckbox : styles.checkbox &&
                                            isHovered ? styles.hoveredCheckbox : styles.checkbox}
                                />
                            </TableCell>
                            <TableCell style={styles.typeIcon} disablePadding><Icon color='primary'>{icons[content.Icon]}</Icon></TableCell>
                            <TableCell style={styles.displayName}>{content.DisplayName}</TableCell>
                            <TableCell>
                                <Moment fromNow>
                                    {content.ModificationDate}
                                </Moment>
                            </TableCell>
                            <TableCell style={styles.actionMenuButton}>
                                <MenuIcon style={
                                    isHovered ? styles.hoveredIcon : styles.icon &&
                                    isSelected ? styles.selectedIcon : styles.icon
                                } />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>)
    }
}

const selectContent = Actions;

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContent(state.sensenet)
    }
}
export default connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent
})(ContentList)