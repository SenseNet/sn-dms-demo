import * as React from 'react'
import Avatar from 'material-ui/Avatar';

const styles = {
    avatar: {
        margin: 10,
    },
};

const defaultAvatar = require('../assets/no-avatar.jpg')

const UserPanel = ({ user }) => (
    <Avatar alt={user.fullName} src={defaultAvatar} style={styles.avatar} title={user.fullName} aria-label={user.fullName} />
)

export default UserPanel