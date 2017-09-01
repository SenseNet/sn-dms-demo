
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

const styles = {
    list: {
        background: '#fff'
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
        width: 30
    },
    loader: {
        margin: '0 auto'
    },
    displayName: {
        fontWeight: 'bold'
    }
}

interface TodoListProps {
    ids,
    children
}

export class ContentList extends React.Component<TodoListProps, { selected }> {
    constructor(props) {
        super(props)
        this.state = {
            selected: []
        };

        this.isSelected = this.isSelected.bind(this);
    }
    handleClick(e, id) { }
    handleKeyDown(e, id) { }
    isSelected(id) { return this.state.selected.indexOf(id) !== -1; }
    render() {
        return (<Table style={styles.list}>
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
                            <TableCell>-</TableCell>
                            <TableCell style={styles.actionMenuButton}>
                                <MenuIcon />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>)
    }
}