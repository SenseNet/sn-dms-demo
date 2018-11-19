import Avatar from '@material-ui/core/Avatar'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '..'

// tslint:disable-next-line:no-var-requires
const defaultAvatar = require('../assets/no-avatar.jpg')

const mapStateToProps = (state: rootStateType) => {
    return {
        repositoryUrl: Reducers.getRepositoryUrl(state.sensenet),
        user: state.sensenet.session.user,
    }
}

const userPanel = ({ user, repositoryUrl }: { user: any, repositoryUrl: string }) => (
    <Avatar
        style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 15 }}
        alt={user.fullName}
        src={user.userAvatarPath.length > 0 ? repositoryUrl + user.userAvatarPath : defaultAvatar}
        aria-label={user.fullName} />
)

export default connect(
    mapStateToProps,
    {
    })(userPanel as React.StatelessComponent)
