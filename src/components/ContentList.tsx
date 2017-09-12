
import * as React from 'react'
import * as keycode from 'keycode';
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

const styles = {
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
        verticalAlign: 'middle'
    }
}

interface TodoListProps {
    ids,
    children
}

export class ContentList extends React.Component<TodoListProps, { selected, order, orderBy, data }> {
    constructor(props) {
        super(props)
        this.state = {
            selected: [],
            order: 'desc',
            orderBy: 'Type',
            data: this.props.children
        };

        this.isSelected = this.isSelected.bind(this);
    }
    handleClick(e, id) { }
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
    isSelected(id) { return this.state.selected.indexOf(id) !== -1; }
    render() {
        return (<Table>
            <ListHead
            numSelected={this.state.selected.length}
            order={this.state.order}
            orderBy={this.state.orderBy}
            onSelectAllClick={this.handleSelectAllClick}
            onRequestSort={this.handleRequestSort}
          />
            <TableBody>
                {this.props.ids.map(n => {
                    //TODO: selection, action, reducer, meg minden
                    let content = this.props.children[n];
                    const isSelected = this.isSelected(content.id);
                    return (
                        <TableRow
                            hover
                            onClick={event => this.handleClick(event, content.Id)}
                            onKeyDown={event => this.handleKeyDown(event, content.Id)}
                            role='checkbox'
                            aria-checked={isSelected}
                            tabIndex='-1'
                            key={content.Id}
                        //selected={isSelected}
                        >
                            <TableCell checkbox style={styles.checkboxButton}>
                                <Checkbox
                                    checked={isSelected}
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
                                <MenuIcon style={styles.icon} />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>)
    }
}