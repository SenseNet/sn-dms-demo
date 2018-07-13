
import { Actions, Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps } from 'react-router'
import * as DMSActions from '../Actions'
import { ListToolbar } from '../components/ContentList/ListToolbar'
import DashboardDrawer from '../components/DashboardDrawer'
import { DmsViewer } from '../components/DmsViewer'
import DocumentLibrary from '../components/DocumentLibrary'
import Header from '../components/Header'
import { rootStateType } from '../index'
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
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
        selectionModeIsOn: DMSReducers.getIsSelectionModeOn(state.dms),
        isViewerOpened: state.dms.viewer.isOpened,
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
    currentViewName: string
    currentUserName: string
}

class Dashboard extends React.Component<DashboardProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DashboardState> {

    public state = {
        currentFolderId: undefined,
        currentSelection: [],
        currentViewName: 'list',
        currentUserName: 'Visitor',
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
                                    <ListToolbar />
                                    <DocumentLibrary currentFolderId={this.state.currentFolderId} />
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
