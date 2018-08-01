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
import { rootStateType } from '../..'

export interface HeaderColumnData {
    id: string
    numeric: boolean
    disablePadding: boolean
    label: string
}

export const defaultHeaderColumnData: HeaderColumnData[] = [
    { id: 'DisplayName', numeric: false, disablePadding: true, label: 'Display Name' },
    { id: 'ModificationDate', numeric: false, disablePadding: true, label: 'Last modified' },
    { id: 'Owner', numeric: false, disablePadding: true, label: 'Owner' },
]

const style = (theme) => createStyles({
    root: {
        color: '#ccc',
        fontFamily: 'Raleway SemiBold',
        fontSize: 14,
    },
    head: {
        color: '#999',
        fontFamily: 'Raleway SemiBold',
        fontSize: 14,
        fontWeight: 'normal',
    },
    sizeIcon: {
        fontSize: 22,
    },
})

interface ListHeadProps {
    numSelected,
    onRequestSort,
    onSelectAllClick,
    order,
    orderBy,
    count,
    classes,
    headerColumnData: HeaderColumnData[]
}

export const mapStateToProps = (state: rootStateType) => ({
    currentOrder: state.sensenet.currentitems.options,
})

export const mapDispatchToProps = ({
})

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
                    {this.props.headerColumnData.map((column) => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                padding={column.disablePadding ? 'none' : 'dense'}
                                classes={{
                                    root: classes.head,
                                }}
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
