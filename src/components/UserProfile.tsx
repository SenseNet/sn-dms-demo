import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { ConstantContent } from '@sensenet/client-core'
import { ContentList } from '@sensenet/list-controls-react'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '..'
import { customSchema } from '../assets/schema'
import WorkspaceSelector from '../components/WorkspaceSelector/WorkspaceSelector'
import { loadUser } from '../store/usersandgroups/actions'
import BreadCrumb from './BreadCrumb'
import UserInfo from './UsersAndGroups/UserInfo'

const styles = {
    appBar: {
        background: '#fff',
    },
    appBarMobile: {
        background: '#4cc9f2',
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0 12px',
    },
    toolbarMobile: {
        padding: '0',
        minHeight: 36,
        borderBottom: 'solid 1px #fff',
        display: 'flex',
        flexDirection: 'row',
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        items: state.dms.usersAndGroups.user.memberships,
        errorMessage: state.dms.usersAndGroups.user.error,
        editedItemId: state.dms.editedItemId,
        ancestors: state.dms.usersAndGroups.user.ancestors,
        user: state.dms.usersAndGroups.user.currentUser,
        isAdmin: state.dms.usersAndGroups.user.isAdmin,
    }
}

const mapDispatchToProps = {
    loadUser,
}

interface UserProfileProps extends RouteComponentProps<any> {
    matchesDesktop,
}

// tslint:disable-next-line:no-empty-interface
interface UserProfileState {
}

class UserProfile extends React.Component<UserProfileProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, UserProfileState> {
    constructor(props: UserProfile['props']) {
        super(props)
        this.state = {
        }
    }

    private static updateStoreFromPath(newProps: UserProfile['props'], lastState: UserProfile['state']) {
        try {
            const idFromUrl = newProps.match.params.folderPath && atob(decodeURIComponent(newProps.match.params.otherActions))
            const userProfilePath = `/Root/IMS/Public/${newProps.loggedinUser.content.Name}`
            newProps.loadUser(idFromUrl || userProfilePath, { select: ['Avatar', 'FullName', 'Email', 'Phone', 'LoginName'] })
        } catch (error) {
            /** Cannot parse current folder from URL */
            return compile(newProps.match.path)({ folderPath: '' })
        }
    }

    public static getDerivedStateFromProps(newProps: UserProfile['props'], lastState: UserProfile['state']) {
        if (newProps.loggedinUser.userName !== 'Visitor') {
            const newPath = UserProfile.updateStoreFromPath(newProps, lastState)
            if (newPath && newPath !== newProps.match.url) {
                newProps.history.push(newPath)
            }
        }
        return {
            ...lastState,
        } as UserProfile['state']
    }

    public render() {
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return this.props.loggedinUser.content.Id !== ConstantContent.VISITOR_USER.Id ?
                    <div>
                        {this.props.isAdmin ? <AppBar position="static" style={matches ? styles.appBar : styles.appBarMobile}>
                            <Toolbar style={matches ? styles.toolbar as any : styles.toolbarMobile as any}>
                                <div style={{ flex: 1, display: 'flex' }}>
                                    <WorkspaceSelector />
                                    <BreadCrumb ancestors={this.props.ancestors} currentContent={this.props.user} />
                                </div>
                            </Toolbar>
                        </AppBar> : null}
                        <UserInfo />
                        <ContentList
                            items={this.props.items.d.results}
                            schema={customSchema.find((s) => s.ContentTypeName === 'Group')} />
                    </div>
                    : null

            }}
        </MediaQuery>
    }
}

export default withRouter(connect<ReturnType<typeof mapStateToProps>, typeof mapDispatchToProps, UserProfileProps>(mapStateToProps, mapDispatchToProps)(UserProfile))
