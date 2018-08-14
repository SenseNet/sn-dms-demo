import { Dialog, DialogContent, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { PathHelper } from '@sensenet/client-utils'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { ContentTemplates } from '../components/ContentTemplates'
import { ContentTypes } from '../components/ContentTypes'
import DashboardDrawer from '../components/DashboardDrawer'
import { DmsViewer } from '../components/DmsViewer'
import DocumentLibrary from '../components/DocumentLibrary'
import { Groups } from '../components/Groups'
import Header from '../components/Header'
import { ListToolbar } from '../components/ListToolbar'
import MessageBar from '../components/MessageBar'
import { SavedQueries } from '../components/SavedQueries'
import { Settings } from '../components/Settings'
import { Shared } from '../components/Shared'
import { Trash } from '../components/Trash'
import { Users } from '../components/Users'

const styles = {
    dashBoardInner: {
        padding: 60,
    },
    dashBoardInnerMobile: {
        padding: '30px 0 0',
    },
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden' as any,
        position: 'relative' as any,
        display: 'flex' as any,
    },
    main: {
        flexGrow: 1,
        backgroundColor: '#eee',
        padding: '0 10px 10px',
        minWidth: 0,
    },
    dialogClose: {
        position: 'absolute',
        right: 0,
    },
    progress: {
        width: '100%',
        textAlign: 'center',
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUserName: state.sensenet.session.user.userName,
        loginState: state.sensenet.session.loginState,
        isViewerOpened: state.dms.viewer.isOpened,
        isDialogOpen: state.dms.dialog.isOpened,
        dialogOnClose: state.dms.dialog.onClose,
        dialogContent: state.dms.dialog.content,
        dialogTitle: state.dms.dialog.title,
    }
}

const mapDispatchToProps = {
    loadUserActions: DMSActions.loadUserActions,
    closeDialog: DMSActions.closeDialog,
}

interface DashboardProps extends RouteComponentProps<any> {
    currentId: number,
}

export interface DashboardState {
    currentSelection: number[]
    currentScope: string
    currentViewName: string
    currentUserName: string
}

class Dashboard extends React.Component<DashboardProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DashboardState> {

    public state = {
        currentFolderId: undefined,
        currentSelection: [],
        currentViewName: 'list',
        currentUserName: 'Visitor',
        currentScope: 'documents',
    }

    constructor(props: Dashboard['props']) {
        super(props)
    }

    public static getDerivedStateFromProps(newProps: Dashboard['props'], lastState: Dashboard['state']) {
        const currentSelection = newProps.match.params.selection && decodeURIComponent(newProps.match.params.selection) || []
        const currentViewName = newProps.match.params.action

        if (newProps.loggedinUserName !== lastState.currentUserName) {
            newProps.loadUserActions(`/Root/IMS/Public/${newProps.loggedinUserName}`, 'DMSUserActions')
        }

        return {
            ...lastState,
            currentSelection,
            currentViewName,
            currentScope: newProps.match.params.scope || 'documents',
            currentUserName: newProps.loggedinUserName,
        }
    }
    public render() {
        const { closeDialog, isDialogOpen, dialogContent } = this.props
        const filter = { filter: this.props.isViewerOpened ? 'blur(3px)' : '' }
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    if (matches) {
                        return <div>
                            <div style={{ ...styles.root, ...filter }}>
                                <Header />
                                <div style={{ width: '100%', display: 'flex' }}>
                                    <DashboardDrawer />
                                    <div style={styles.main}>
                                        <div style={{ height: 48, width: '100%' }}></div>
                                        <Switch>
                                            <Route path="/documents" component={(props: RouteComponentProps<any>) => (
                                                <Switch>
                                                    <Route path={props.match.url + '/shared'}>
                                                        <Shared />
                                                    </Route>

                                                    <Route path={props.match.url + '/savedqueries'}>
                                                        <SavedQueries />
                                                    </Route>
                                                    <Route path={props.match.url + '/trash'}>
                                                        <Trash />
                                                    </Route>
                                                    <Route path={'/' + PathHelper.joinPaths(props.match.url, '/:folderPath?')} exact component={() => (
                                                        <div>
                                                            <ListToolbar />
                                                            <DocumentLibrary />
                                                        </div>
                                                    )}>
                                                    </Route>
                                                </Switch>
                                            )} >
                                            </Route>
                                            <Route path="/users" >
                                                <Users />
                                            </Route>
                                            <Route path="/groups" >
                                                <Groups />
                                            </Route>
                                            <Route path="/contenttypes" >
                                                <ContentTypes />
                                            </Route>
                                            <Route path="/contenttemplates" >
                                                <ContentTemplates />
                                            </Route>
                                            <Route path="/settings" >
                                                <Settings />
                                            </Route>

                                            <Redirect to="/documents" />
                                        </Switch>
                                        <MessageBar />
                                    </div>
                                </div>
                            </div>
                            <DmsViewer />
                            <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="md">
                                <DialogContent children={dialogContent} />
                                <IconButton onClick={closeDialog} style={styles.dialogClose as any}>
                                    <CloseIcon />
                                </IconButton>
                            </Dialog>
                        </div>
                    } else {
                        return <div style={styles.root}>
                            <div style={styles.dashBoardInnerMobile}>
                                <ListToolbar />
                                <DocumentLibrary />
                            </div>
                        </div>
                    }

                }}
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
