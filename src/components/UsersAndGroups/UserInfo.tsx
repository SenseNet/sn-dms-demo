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

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        padding: 12,
        margin: '10px 0',
    },
    leftColumn: {
        flex: '0 0 0%',
    },
    rightColumn: {
        flex: '1 1 0%',
        paddingLeft: 10,
    },
    avatar: {
        width: 70,
        height: 70,
    },
    fullName: {
        color: '#666666',
        fontFamily: 'Raleway SemiBold',
        fontSize: 21,
        flexDirection: 'column',
    },
    editIcon: {
        cursor: 'pointer',
        fontSize: 18,
        flexDirection: 'column',
        marginLeft: 5,
        marginTop: 5,
    },
    email: {
        color: '#016D9E',
        textDecoration: 'none',
        fontFamily: 'Raleway SemiBold',
        fontSize: 16,
        marginTop: 5,
        display: 'block',
    },
    phone: {
        color: '#666666',
        fontFamily: 'Raleway SemiBold',
        fontSize: 16,
        textDecoration: 'none',
        marginTop: 5,
        display: 'block',
    },
}

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
            isLoading ? null : <Paper style={styles.container as any}>
                <div style={styles.leftColumn}>
                    <Avatar alt={user.FullName} src={avatarUrl} style={styles.avatar} />
                </div>
                <div style={styles.rightColumn}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography style={styles.fullName as any}>{user.FullName}</Typography>
                        {user.Name === currentUser ?
                            <Icon iconName="edit" onClick={() => this.handleEditClick()} style={styles.editIcon} />
                            : null}
                    </div>
                    <a href={`mailto:${user.Email}`} style={styles.email}>{user.Email}</a>
                    <Typography><a href={`tel:${user.Phone}`} style={styles.phone}>{user.Phone}</a></Typography>
                </div>
            </Paper >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
