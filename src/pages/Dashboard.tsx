
import { Dialog, DialogContent, IconButton, LinearProgress } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { Actions, Reducers } from '@sensenet/redux'
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
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
        selectionModeIsOn: DMSReducers.getIsSelectionModeOn(state.dms),
        isViewerOpened: state.dms.viewer.isOpened,
        isDialogOpen: state.dms.dialog.isOpened,
        dialogOnClose: state.dms.dialog.onClose,
        dialogContent: state.dms.dialog.content,
        dialogTitle: state.dms.dialog.title,
    }
}

const mapDispatchToProps = {
    loadContent: Actions.loadContent,
    setCurrentId: DMSActions.setCurrentId,
    loadUserActions: DMSActions.loadUserActions,
}

interface DashboardProps extends RouteComponentProps<any> {
    currentId: number,
}

export interface DashboardState {
    currentFolderId?: number
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
        let currentFolderId = newProps.match.params.folderId && parseInt(newProps.match.params.folderId.toString(), 10) || undefined
        const currentSelection = newProps.match.params.selection && decodeURIComponent(newProps.match.params.selection) || []
        const currentViewName = newProps.match.params.action

        if (lastState.currentFolderId !== currentFolderId && currentFolderId) {
            newProps.setCurrentId(currentFolderId)
            newProps.loadContent(currentFolderId)
        }

        if (newProps.loggedinUserName !== lastState.currentUserName) {
            newProps.loadUserActions(`/Root/IMS/Public/${newProps.loggedinUserName}`, 'DMSUserActions')

            if (lastState.currentFolderId === currentFolderId && currentFolderId === undefined) {
                newProps.loadContent(`/Root/Profiles/Public/${newProps.loggedinUserName}/Document_Library`)
                currentFolderId = 0

            }
        }

        return {
            ...lastState,
            currentFolderId,
            currentSelection,
            currentViewName,
            currentScope: newProps.match.params.scope || 'documents',
            currentUserName: newProps.loggedinUserName,
        }
    }

    public render() {
        const { isDialogOpen, dialogContent, dialogOnClose } = this.props
        const filter = { filter: this.props.isViewerOpened ? 'blur(3px)' : '' }
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    if (matches) {
                        return <div>
                            <div style={{ ...styles.root, ...filter }}>
                                <Header />
                                {this.props.currentContent ?
                                    <div style={{ width: '100%', display: 'flex' }}>
                                        <DashboardDrawer />
                                        <div style={styles.main}>
                                            <div style={{ height: 48, width: '100%' }}></div>
                                            <Switch>
                                                <Route path="/documents/:viewName?/:contentId?" >
                                                    <div>
                                                        <ListToolbar />
                                                        <DocumentLibrary currentFolderId={this.state.currentFolderId} />
                                                    </div>
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
                                    </div> :
                                    <div style={styles.progress as any} >
                                        <LinearProgress />
                                    </div>
                                }
                            </div>
                            <DmsViewer />
                            <Dialog open={isDialogOpen} onClose={dialogOnClose}>
                                <DialogContent children={dialogContent} />
                                <IconButton onClick={dialogOnClose} style={styles.dialogClose as any}>
                                    <CloseIcon />
                                </IconButton>
                            </Dialog>
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
