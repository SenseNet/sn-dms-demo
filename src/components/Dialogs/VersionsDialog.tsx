import { Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles, IconButton } from '@material-ui/core'
import { Icon } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import RestoreIcon from '@material-ui/icons/Restore'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'

const styles = {
    buttonContainer: {
        display: 'flex',
        height: 32,
    },
    containerChild: {
        flexGrow: 1,
        display: 'inline-flex',
    },
    rightColumn: {
        textAlign: 'right',
        flexGrow: 1,
        marginLeft: 'auto',
    },
    inner: {
        minWidth: 550,
        fontFamily: 'Raleway Medium',
        fontSize: 14,
        margin: '20px 0',
    },
    contentName: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        flexShrink: 0,
    },
    uploadVersionButton: {
        marginRight: 20,
        backgroundColor: '#016d9e',
        color: '#fff',
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
        minWidth: 800,
        marginTop: 20,
    },
    versionNumber: {
        color: '#016D9E',
        fontFamily: 'Raleway Semibold',
    },
    versionTableHead: {
        fontFamily: 'Raleway Semibold',
        fontSize: 12,
        color: '#000',
        opacity: .54,
    },
    versionTableCell: {
        fontSize: 13,
        width: '26%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: 200,
    },
}

interface VersionsDialogProps {
    id: number,
    closeCallback?: () => void
}

const mapStateToProps = (state: rootStateType, props: VersionsDialogProps) => {
    return {
        currentitems: state.sensenet.currentitems.entities,
        versions: state.dms.versions,
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    getVersionList: DMSActions.loadVersions,
}

interface VersionsDialogState {
    versions: GenericContent[],
}

class VersionsDialog extends React.Component<{ classes } & VersionsDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, VersionsDialogState> {
    public state: VersionsDialogState = {
        versions: [],
    }
    constructor(props: VersionsDialog['props']) {
        super(props)
        this.props.getVersionList(this.props.id)
    }
    public static getDerivedStateFromProps(newProps: VersionsDialog['props'], lastState: VersionsDialogState) {
        if (newProps.versions && newProps.versions.length !== lastState.versions.length) {
            newProps.getVersionList(newProps.id)
        }
        return {
            ...lastState,
            versions: newProps.versions,
        }
    }

    public handleCancel = () => {
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public submitCallback = () => {
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public render() {
        const { classes, currentitems, id, versions } = this.props
        console.log(id)
        const currentContent = currentitems.find((item) => item.Id === id)
        const icon = currentContent.Icon
        return (
            <div>
                <Typography variant="headline" gutterBottom>
                    {resources.VERSIONS}
                </Typography>
                <div style={styles.inner}>
                    <div style={styles.contentName}>
                        <Icon color="primary" style={styles.icon}>{icons[icon.toLowerCase()]}</Icon>
                        <span className={classes.displayName}>
                            {currentContent.DisplayName}
                        </span>
                    </div>
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
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.versionTableHead}>{resources.VERSION}</TableCell>
                                <TableCell padding="checkbox" className={classes.versionTableHead}>{resources.MODIFIED}</TableCell>
                                <TableCell padding="checkbox" className={classes.versionTableHead}>{resources.COMMENT}</TableCell>
                                <TableCell padding="checkbox" className={classes.versionTableHead}>{resources.REJECT_REASON}</TableCell>
                                <TableCell padding="none" className={classes.versionTableHead}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {versions.map((version, index) =>
                                <TableRow key={index}>
                                    <TableCell className={classes.versionNumber}>{version.Version}</TableCell>
                                    <TableCell padding="checkbox" className={classes.versionTableCell}>
                                        <Moment fromNow>{version.ModificationDate}</Moment>
                                        {
                                            // tslint:disable-next-line:no-string-literal
                                            ` (${version.ModifiedBy['FullName']})`
                                        }
                                    </TableCell>
                                    <TableCell padding="checkbox" className={classes.versionTableCell}>{version.CheckInComments ? version.CheckInComments : ''}</TableCell>
                                    <TableCell padding="checkbox" className={classes.versionTableCell}>{version.RejectReason ? version.RejectReason : ''}</TableCell>
                                    <TableCell padding="none" style={{ width: '5%' }}>
                                        {index > 0 ? <IconButton><RestoreIcon color="error" /></IconButton> : null}
                                    </TableCell>
                                </TableRow>,
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div style={styles.buttonContainer}>
                    <div style={styles.containerChild}>
                        <Button variant="contained"
                            component="span"
                            color="primary" className={classes.uploadVersionButton} onClick={() => this.handleCancel()}>{resources.UPLOAD_NEW_VERSION}</Button>
                    </div>
                    <div style={styles.rightColumn as any}>
                        <Button onClick={() => this.submitCallback()} variant="raised" color="secondary">{resources.OK}</Button>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(VersionsDialog))
