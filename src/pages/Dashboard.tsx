
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../Actions'
import { ListToolbar } from '../components/ContentList/ListToolbar'
import DashboarDrawer from '../components/DashboardDrawer'
import DocumentLibrary from '../components/DocumentLibrary'
import FloatingActionButton from '../components/FloatingActionButton'
import Header from '../components/Header'
import MessageBar from '../components/MessageBar'
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

interface DashboardProps {
    match,
    currentContent,
    loggedinUser,
    loadContent,
    loadUserActions,
    setCurrentId,
    currentId,
    selectionModeIsOn: boolean
}

class Dashboard extends React.Component<DashboardProps, {}> {
    constructor(props) {
        super(props)
        this.state = {
            currentId: this.props.match.params.id ? this.props.match.params.id : '',
        }
    }
    public componentDidMount() {
        const id = parseInt(this.props.match.params.id, 10)
        if (id && !isNaN(id) && isFinite(id)) {
            this.props.setCurrentId(id)
        } else {
            if (this.props.match.params.id !== undefined && this.props.match.params.id !== this.props.currentId) {
                if (this.props.loggedinUser.userName !== 'Visitor') {
                    return this.props.setCurrentId(this.props.match.params.id)
                        && this.props.loadContent(`/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library`)
                        && this.props.loadUserActions(`/Root/IMS/Public/${this.props.loggedinUser.userName}`, 'DMSUserActions')
                }
            }
        }
    }
    public componentWillReceiveProps(nextProps) {
        const id = nextProps.match.params.id === undefined ? 'login' : parseInt(nextProps.match.params.id, 10)
        if ((nextProps.currentId !== undefined && this.props.currentId !== nextProps.currentId) || nextProps.currentId === 'login' || id === 'login') {
            if (id && !isNaN(id as any) && isFinite(id as any)) {
                this.props.setCurrentId(id)
                this.props.loadContent(id)
            } else if (nextProps.currentId && this.props.currentId !== nextProps.currentId &&
                !isNaN(id as any) &&
                id === Number(nextProps.currentId)) {
                if (nextProps.loggedinUser.userName !== 'Visitor') {
                    this.props.setCurrentId(id)
                    this.props.loadContent(id)
                }
            }
            if (id === 'login' && this.props.currentId === null) {
                this.props.loadContent(`/Root/Profiles/Public/${nextProps.loggedinUser.userName}/Document_Library`)
            }
            if (nextProps.loggedinUser.userName !== this.props.loggedinUser.userName) {
                id === 'login' &&  nextProps.loggedinUser.userName !== 'Visitor' ?
                    this.props.setCurrentId(id) &&
                    this.props.loadContent(`/Root/Profiles/Public/${nextProps.loggedinUser.userName}/Document_Library`)
                    && this.props.loadUserActions(`/Root/IMS/Public/${nextProps.loggedinUser.userName}`, 'DMSUserActions') :
                    this.props.setCurrentId(Number(nextProps.match.params.id)) &&
                    this.props.loadContent(Number(nextProps.match.params.id))
            } else {
                id === 'login' &&  nextProps.loggedinUser.userName !== 'Visitor' ?
                    this.props.setCurrentId('login') :
                    this.props.setCurrentId(nextProps.currentContent.Id)
            }
        }
    }
    public render() {
        const { id } = this.props.match.params
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    if (matches) {
                        return <div style={styles.root}>
                            <Header />
                            <DashboarDrawer />
                            <div style={styles.main}>
                                <div style={{ height: 48, width: '100%' }}></div>
                                <ListToolbar />
                                <DocumentLibrary parentId={id} />
                            </div>
                        </div>
                    } else {
                        return <div style={styles.root}>
                            <div style={styles.dashBoardInnerMobile}>
                                <ListToolbar />
                                <DocumentLibrary parentId={id} />
                            </div>
                        </div>
                    }
                }}
            </MediaQuery>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
        selectionModeIsOn: DMSReducers.getIsSelectionModeOn(state.dms),
    }
}

export default connect(mapStateToProps, {
    loadContent: Actions.loadContent,
    setCurrentId: DMSActions.setCurrentId,
    loadUserActions: DMSActions.loadUserActions,
})(Dashboard)
