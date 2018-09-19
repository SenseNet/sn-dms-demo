import { Button, Dialog, DialogContent, Drawer, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { LoginState } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { ContentTemplates } from '../components/ContentTemplates'
import { ContentTypes } from '../components/ContentTypes'
import DashboardDrawer from '../components/DashboardDrawer'
import { DmsViewer } from '../components/DmsViewer'
import DocumentLibrary from '../components/DocumentLibrary'
import { Groups } from '../components/Groups'
import Header from '../components/Header'
import MessageBar from '../components/MessageBar'
import MobileHeader from '../components/Mobile/Header'
import Picker from '../components/Pickers/PickerBase'
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
        marginTop: 36,
        width: '100%',
    },
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden' as any,
        position: 'relative' as any,
        display: 'flex' as any,
    },
    rootMobile: {
        flexGrow: 1,
        zIndex: 1,
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
    dialogCloseMobile: {
        position: 'absolute',
        right: 0,
        top: '15px',
        fontFamily: 'Raleway Medium',
        color: '#016D9E',
        fontSize: '14px',
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
        isDialogOpen: state.dms.dialog.isOpened,
        dialogContent: state.dms.dialog.content,
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

        if (this.props.loginState !== LoginState.Unauthenticated && this.props.loggedinUserName === 'Visitor') {
            return null
        }

        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <div>
                        <div style={matches ? { ...styles.root } : { ...styles.rootMobile }}>
                            {matches ? <Header /> : <MobileHeader />}
                            {matches ? null : <DashboardDrawer />}
                            {matches ?
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
                                                    <Route path={'/' + PathHelper.joinPaths(props.match.url, '/:folderPath?/:otherActions*')} exact component={() => (
                                                        <div>
                                                            <DocumentLibrary matchesDesktop={matches} />
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

                                            {/* <Redirect to="/documents" /> */}
                                        </Switch>
                                        <MessageBar />
                                    </div>
                                </div>
                                :
                                <div style={styles.dashBoardInnerMobile}>
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
                                                <Route path={'/' + PathHelper.joinPaths(props.match.url, '/:folderPath?/:otherActions*')} exact component={() => (
                                                    <div>
                                                        <DocumentLibrary matchesDesktop={matches} />
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

                                        {/* <Redirect to="/documents" /> */}
                                    </Switch>
                                    <MessageBar />
                                </div>}
                        </div>
                        <Route exact path="/:prefix*/preview/:documentId" component={() =>
                            <DmsViewer />
                        } />
                        {matches ? <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="md">
                            <DialogContent children={dialogContent} />
                            <IconButton onClick={closeDialog} style={styles.dialogClose as any}>
                                <CloseIcon />
                            </IconButton>
                        </Dialog> :
                            <Drawer open={isDialogOpen} anchor="bottom" onClose={closeDialog}>
                                <DialogContent children={dialogContent} />
                                <Button onClick={closeDialog} style={styles.dialogCloseMobile as any}>
                                    Cancel
                                </Button>
                            </Drawer>
                        }
                        <Picker />
                    </div>
                }}
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
