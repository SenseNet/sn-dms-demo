import * as React from 'react'
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import { icons } from '../assets/icons'

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'
    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'
    },
    parentDisplayName: {
        width: 30,
        lineHeight: '9px',
        fontFamily: 'roboto',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    loader: {
        margin: '0 auto'
    },
    displayName: {
        fontWeight: 'bold'
    },
    icon: {
        verticalAlign: 'middle'
    },
    table: {
        background: '#fff'
    }
}

interface IParentFolderTableRow {
    currentId,
}

export class ParentFolderTableRow extends React.Component<IParentFolderTableRow, {}>{
    handleClick(e, id){}
    handleKeyDown(e, id){}
    render() {
        return (
            <TableRow
                hover
                onClick={event => this.handleClick(event, this.props.currentId)}
                onKeyDown={event => this.handleKeyDown(event, this.props.currentId)}
                tabIndex='-1'
                key={this.props.currentId}
            >
                <TableCell checkbox style={styles.checkboxButton}></TableCell>
                <TableCell style={styles.parentDisplayName} disablePadding>[ ... ]</TableCell>
                <TableCell style={styles.displayName}></TableCell>
                <TableCell></TableCell>
                <TableCell style={styles.actionMenuButton}></TableCell>
            </TableRow>
        )
    }
}