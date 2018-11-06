import { ConstantContent } from '@sensenet/client-core'
import { ContentList } from '@sensenet/list-controls-react'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '..'
import { customSchema } from '../assets/schema'
import { loadUser } from '../store/usersandgroups/actions'
import UserInfo from './UsersAndGroups/UserInfo'

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        items: state.dms.usersAndGroups.user.memberships,
        errorMessage: state.dms.usersAndGroups.user.error,
        editedItemId: state.dms.editedItemId,
    }
}

const mapDispatchToProps = {
    loadUser,
}

interface UserProfileProps extends RouteComponentProps<any> {
    matchesDesktop
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
        return this.props.loggedinUser.content.Id !== ConstantContent.VISITOR_USER.Id ?
            <div>
                <UserInfo />
                <ContentList
                    items={this.props.items.d.results}
                    schema={customSchema.find((s) => s.ContentTypeName === 'Group')} />
            </div>
            : null

    }
}

export default withRouter(connect<ReturnType<typeof mapStateToProps>, typeof mapDispatchToProps, UserProfileProps>(mapStateToProps, mapDispatchToProps)(UserProfile))
