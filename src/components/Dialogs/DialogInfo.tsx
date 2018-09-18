import { Icon, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'

const styles = {
    contentName: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        flexShrink: 0,
        marginRight: 5,
    },
    displayName: {
        fontSize: 16,
    },
    tableHead: {
        fontFamily: 'Raleway SemiBold',
        fontSize: 12,
        color: '#000',
        border: 0,
        paddingBottom: 0,
    },
    tableCell: {
        border: 0,
        fontStyle: 'italic',
        fontSize: 12,
    },
    tableRow: {
        height: 24,
    },
    table: {
        boxShadow: '0px 0px 3px 0px rgba(0,0,0,0.3)',
        marginTop: 10,
    },
    inner: {
        fontFamily: 'Raleway Medium',
        fontSize: 14,
        margin: '20px 0',
    },
}

interface DialogInfoProps {
    currentContent: GenericContent
    hideVersionInfo?: boolean
}

class DialogInfo extends React.Component<{ classes } & DialogInfoProps, {}> {
    public render() {
        const { classes, currentContent } = this.props
        const icon = currentContent.Icon
        return (
            <div style={styles.inner}>
                <div style={styles.contentName}>
                    <Icon color="primary" style={styles.icon}>{icons[icon.toLowerCase()]}</Icon>
                    <span className={classes.displayName}>
                        {currentContent.DisplayName}
                    </span>
                </div>
                {this.props.hideVersionInfo ? null :
                    <Table>
                        <TableHead>
                            <TableRow className={classes.tableRow}>
                                <TableCell className={classes.tableHead} padding="none">{resources.VERSIONING_MODE}</TableCell>
                                <TableCell className={classes.tableHead} padding="none">{resources.PATH}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow className={classes.tableRow}>
                                <TableCell className={classes.tableCell} padding="none">
                                    {resources.VERSIONING[currentContent.VersioningMode]}
                                </TableCell>
                                <TableCell className={classes.tableCell} padding="none">
                                    {currentContent.Path}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                }
            </div>
        )
    }
}

export default withStyles(styles as any)(DialogInfo)
