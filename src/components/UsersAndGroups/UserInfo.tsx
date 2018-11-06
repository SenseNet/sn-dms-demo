import { Typography } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import { User } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import EditPropertiesDialog from '../Dialogs/EditPropertiesDialog'

import { resources } from '../../assets/resources'

// tslint:disable-next-line:no-var-requires
const defaultAvatar = require('../../assets/no-avatar.jpg')

// tslint:disable-next-line:no-empty-interface
interface UserInfoProps {
    user: User,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        user: state.dms.usersAndGroups.user.currentUser,
        isLoading: state.dms.usersAndGroups.user.isLoading,
        repositoryUrl: state.sensenet.session.repository.repositoryUrl,
        currentUser: state.sensenet.session.user.userName,
    }
}

const mapDispatchToProps = {
    openDialog: DMSActions.openDialog,
    closeDialog: DMSActions.closeDialog,
}

class UserInfo extends React.Component<UserInfoProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public handleEditClick = () => {
        this.props.openDialog(
            <EditPropertiesDialog
                content={this.props.user}
                contentTypeName="User" />,
            resources.EDIT_PROPERTIES, this.props.closeDialog)
    }
    public render() {
        const { isLoading, repositoryUrl, user, currentUser } = this.props
        // tslint:disable-next-line:no-string-literal
        const avatarUrl = !isLoading && user.Avatar['_deferred'].length > 0 ? repositoryUrl + user.Avatar['_deferred'] : defaultAvatar
        return (
            isLoading ? null : <Paper style={{ display: 'flex', flexDirection: 'row', padding: 12, margin: '10px 0' }}>
                <div style={{ flex: '0 0 0%' }}>
                    <Avatar alt={user.FullName} src={avatarUrl} style={{ width: 70, height: 70 }} />
                </div>
                <div style={{ flex: '1 1 0%' }}>
                    <Typography>{user.FullName}</Typography>
                    {user.Name === currentUser ?
                        <Icon iconName="edit" onClick={() => this.handleEditClick()} />
                        : null}
                    <a>{user.Email}</a>
                    <Typography>{user.Phone}</Typography>
                </div>
            </Paper >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
