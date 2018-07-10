import { withStyles } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import createStyles from '@material-ui/core/styles/createStyles'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import * as React from 'react'

const columnData = [
    // { id: 'Icon', numeric: false, disablePadding: true, label: 'Type' },
    { id: 'DisplayName', numeric: false, disablePadding: true, label: 'Display Name' },
    { id: 'ModificationDate', numeric: false, disablePadding: true, label: 'Last modified' },
    { id: 'Owner', numeric: false, disablePadding: true, label: 'Owner' },
]

const style = (theme) => createStyles({
    root: {
        color: '#ccc',
    },
    sizeIcon: {
        fontSize: 20,
    },
})

interface ListHeadProps {
    numSelected,
    onRequestSort,
    onSelectAllClick,
    order,
    orderBy,
    count,
    classes
}

class ListHead extends React.Component<ListHeadProps, {}> {
    public createSortHandler = (property) => (event) => {
        this.props.onRequestSort(event, property)
    }
    public render() {
        const { onSelectAllClick, order, orderBy, numSelected, classes } = this.props

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="none">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < this.props.count}
                            checked={numSelected === this.props.count}
                            onChange={onSelectAllClick}
                            color="primary"
                            classes={{
                                root: classes.root,
                            }}
                            style={{ fontSize: 20 }}
                            icon={<CheckBoxOutlineBlankIcon className={classes.sizeIcon} />}
                            checkedIcon={<CheckBoxIcon className={classes.sizeIcon} />}
                        />
                    </TableCell>
                    {columnData.map((column) => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                padding={column.disablePadding ? 'none' : 'dense'}
                            >
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={this.createSortHandler(column.id)}
                                >
                                    {column.label}
                                </TableSortLabel>
                            </TableCell>
                        )
                    }, this)}
                    <TableCell>
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }
}

export default withStyles(style)(ListHead)
