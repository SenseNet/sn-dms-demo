
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { ListToolbar } from '../components/ContentList/ListToolbar'
import DashboardDrawer from '../components/DashboardDrawer'
import { DmsViewer } from '../components/DmsViewer'
import DocumentLibrary from '../components/DocumentLibrary'
import Header from '../components/Header'
import * as DMSReducers from '../Reducers'

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
}

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUserName: state.sensenet.session.user.userName,
        loginState: state.sensenet.session.loginState,
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
        selectionModeIsOn: DMSReducers.getIsSelectionModeOn(state.dms),
        isViewerOpened: state.dms.viewer.isOpened,
    }
}

const mapDispatchToProps = {
    loadUserActions: DMSActions.loadUserActions,
}

interface DashboardProps extends RouteComponentProps<any> {
    currentId: number,
}

export interface DashboardState {
    currentUserName: string
    currentSelection: number[]
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
        if (newProps.loggedinUserName !== lastState.currentUserName) {
            newProps.loadUserActions(`/Root/IMS/Public/${newProps.loggedinUserName}`, 'DMSUserActions')

        }

        return {
            ...lastState,
            currentUserName: newProps.loggedinUserName,
        }
    }

    public render() {
        const filter = { filter: this.props.isViewerOpened ? 'blur(3px)' : '' }
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    if (matches) {
                        return <div>
                            <div style={{ ...styles.root, ...filter }}>
                                <Header />
                                <DashboardDrawer />
                                <div style={styles.main}>
                                    <div style={{ height: 48, width: '100%' }}></div>
                                    <Switch>
                                        <Route path="/documents" component={(props: RouteComponentProps<any>) => (
                                            <Switch>
                                                <Route path={props.match.url + '/shared'}>
                                                    <div>Shared</div>
                                                </Route>

                                                <Route path={props.match.url + '/savedqueries'}>
                                                    <div>SavedQueries</div>
                                                </Route>
                                                <Route path={props.match.url + '/trash'}>
                                                    <div>Trash</div>
                                                </Route>
                                                <Route path={props.match.url + '/:folderId?'} component={(idProps) => (
                                                    <div>
                                                        <ListToolbar />
                                                        <DocumentLibrary currentFolderId={idProps.match.params.folderId} />
                                                    </div>
                                                )}>
                                                </Route>
                                            </Switch>
                                        )} >
                                        </Route>
                                        <Route path="/users" >
                                            <div>Placeholder for users</div>
                                        </Route>
                                        <Route path="/groups" >
                                            <div>Placeholder for groups</div>
                                        </Route>
                                        <Route path="/contenttypes" >
                                            <div>Placeholder for content types</div>
                                        </Route>
                                        <Route path="/contenttemplates" >
                                            <div>Placeholder for content templates</div>
                                        </Route>
                                        <Route path="/settings" >
                                            <div>Placeholder for content settings</div>
                                        </Route>

                                        <Redirect to="/documents" />
                                    </Switch>
                                </div>
                            </div>
                            <DmsViewer />
                        </div>
                    } else {
                        return <div style={styles.root}>
                            <div style={styles.dashBoardInnerMobile}>
                                <ListToolbar />
                                <DocumentLibrary currentFolderId={this.state.currentFolderId} />
                            </div>
                        </div>
                    }
                }}
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
