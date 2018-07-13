
import { Actions, Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
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
        loggedinUserName: state.sensenet.session.user.name,
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

interface DashboardProps {
    match: { params: { id: number } }
    currentId: number,
}

export interface DashboardState {
    currentId: number
}

class Dashboard extends React.Component<DashboardProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DashboardState> {
    constructor(props: Dashboard['props']) {
        super(props)
    }
    public componentDidMount() {
        const id = parseInt(this.props.match.params.id.toString(), 10)
        if (id && !isNaN(id) && isFinite(id)) {
            this.props.setCurrentId(id)
        } else {
            if (this.props.match.params.id !== undefined && this.props.match.params.id !== this.props.currentId) {
                if (this.props.loggedinUserName !== 'Visitor') {
                    return this.props.setCurrentId(this.props.match.params.id)
                        && this.props.loadContent(`/Root/Profiles/Public/${this.props.loggedinUserName}/Document_Library`)
                        && this.props.loadUserActions(`/Root/IMS/Public/${this.props.loggedinUserName}`, 'DMSUserActions')
                }
            }
        }
    }
    public componentWillReceiveProps(nextProps: this['props']) {
        const { currentId, setCurrentId, loadContent, loadUserActions } = this.props

        if (this.props.match.params.id !== undefined && !isNaN(nextProps.match.params.id) && Number(this.props.match.params.id) !== this.props.currentId) {
            setCurrentId(Number(nextProps.match.params.id)) &&
                loadContent(Number(nextProps.match.params.id))
        } else {
            if (currentId && currentId !== nextProps.currentId && nextProps.loggedinUserName !== 'Visitor') {
                setCurrentId(nextProps.currentId)
                loadContent(nextProps.currentId)
                loadUserActions(`/Root/IMS/Public/${nextProps.loggedinUserName}`, 'DMSUserActions')
            } else if (currentId === null && nextProps.loggedinUserName !== 'Visitor') {
                setCurrentId('login')
                loadContent(`/Root/Profiles/Public/${nextProps.loggedinUserName}/Document_Library`)
                loadUserActions(`/Root/IMS/Public/${nextProps.loggedinUserName}`, 'DMSUserActions')
            }
        }
    }
    public render() {
        const { id } = this.props.match.params
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
                                    <DocumentLibrary />
                                </div>
                            </div>
                            <DmsViewer />
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
