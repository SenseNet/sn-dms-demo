import * as React from 'react'
import Table, {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';

const columnData = [
    { id: 'Icon', numeric: false, disablePadding: true, label: 'Type' },
    { id: 'DisplayName', numeric: false, disablePadding: false, label: 'Display Name' },
    { id: 'ModificationDate', numeric: false, disablePadding: false, label: 'Last modified' },
];

interface IListHeadProps {
    numSelected,
    onRequestSort,
    onSelectAllClick,
    order,
    orderBy
}

export class ListHead extends React.Component<IListHeadProps, {}> {

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell checkbox>
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < 5}
                            checked={numSelected === 5}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {columnData.map(column => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                disablePadding={column.disablePadding}
                            >
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={this.createSortHandler(column.id)}
                                >
                                    {column.label}
                                </TableSortLabel>
                            </TableCell>
                        );
                    }, this)}
                    <TableCell>
                    </TableCell>
                </TableRow>
            </TableHead>
        );
    }
}