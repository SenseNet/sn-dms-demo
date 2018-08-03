import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, withStyles } from '@material-ui/core'
import { Icon } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import RestoreIcon from '@material-ui/icons/Restore'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { versionName } from '../../assets/helpers'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import RestoreVersionsDialog from './RestoreVersionDialog'

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
        marginTop: 10,
    },
    versionNumber: {
        color: '#016D9E',
        fontFamily: 'Raleway Semibold',
        fontSize: 13,
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
    tableContainer: {},
    tableContainerScroll: {
        maxHeight: 300,
        overflowY: 'auto',
        padding: 5,
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
    openDialog: DMSActions.openDialog,
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
        this.handleRestoreButtonClick = this.handleRestoreButtonClick.bind(this)
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
    public formatVersionNumber = (version: string) => {
        const v = resources[`VERSION_${versionName(version.slice(-1))}`]
        return `${version.substring(0, version.length - 2)} ${v}`
    }
    public handleRestoreButtonClick = (id: number, version: string, name: string) => {
        this.props.closeDialog()
        this.props.openDialog(<RestoreVersionsDialog id={id} version={version} fileName={name} />)
    }
    public render() {
        const { classes, currentitems, id, versions } = this.props
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
                    <div style={versions.length > 3 ? styles.tableContainerScroll : styles.tableContainer }>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" className={classes.versionTableHead}>{resources.VERSION}</TableCell>
                                <TableCell padding="checkbox" className={classes.versionTableHead}>{resources.MODIFIED}</TableCell>
                                <TableCell padding="checkbox" className={classes.versionTableHead}>{resources.COMMENT}</TableCell>
                                <TableCell padding="checkbox" className={classes.versionTableHead}>{resources.REJECT_REASON}</TableCell>
                                <TableCell padding="none" className={classes.versionTableHead}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {versions.map((version, index) =>
                                <TableRow key={index}>
                                    <TableCell padding="checkbox" className={classes.versionNumber}>{this.formatVersionNumber(version.Version)}</TableCell>
                                    <TableCell padding="checkbox" className={classes.versionTableCell}>
                                        <Moment fromNow>{version.ModificationDate}</Moment>
                                        {
                                            // tslint:disable-next-line:no-string-literal
                                            ` (${version.ModifiedBy['FullName']})`
                                        }
                                    </TableCell>
                                    <TableCell
                                        padding="checkbox"
                                        className={classes.versionTableCell}>
                                        <Tooltip disableFocusListener title={version.CheckInComments ? version.CheckInComments : ''}>
                                            <span>{version.CheckInComments ? version.CheckInComments : ''}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell padding="checkbox" className={classes.versionTableCell}>
                                        <Tooltip disableFocusListener title={version.RejectReason ? version.RejectReason : ''}>
                                            <span>{version.RejectReason ? version.RejectReason : ''}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell padding="none" style={{ width: '5%' }}>
                                        {index !== versions.length - 1 ? <IconButton
                                            title={resources.RESTORE_VERSION}
                                            onClick={() => this.handleRestoreButtonClick(id, version.Version, version.Name)}><RestoreIcon color="error" /></IconButton> : null}
                                    </TableCell>
                                </TableRow>,
                            )}
                        </TableBody>
                    </Table>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(VersionsDialog))
