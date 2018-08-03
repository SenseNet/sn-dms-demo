import { WithStyles, withStyles } from '@material-ui/core'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import UsersIcon from '@material-ui/icons/SupervisorAccount'
import * as React from 'react'

import { resources } from '../../assets/resources'

const styles = () => ({
    button: {
        'margin': 0,
        'padding': 0,
        'minWidth': 'auto',
        'color': '#fff',
        'fontSize': 15,
        '&:hover': {
            backgroundColor: '#016d9e',
        },
    },
    leftIcon: {
        marginRight: 5,
        color: '#fff',
    },
    badge: {
        top: 1,
        right: -15,
        fontSize: 12,
        fontFamily: 'Raleway ExtraBold',
        width: 18,
        height: 18,
        lineHeight: '16px',
        textAlign: 'center',
        display: 'block',
    },
})
type C = 'badge'

class SharedWorkspaces extends React.Component<{ classes } & WithStyles<C>, {}> {
    public render() {
        const { classes } = this.props
        return (
            <Badge color="error" badgeContent={3} classes={{ badge: classes.badge }}>
                <Button disableRipple={true} disableFocusRipple={true} className={classes.button}>
                    <UsersIcon className={classes.leftIcon} />
                    {resources.SHARED_WITH_ME}
                </Button>
            </Badge>)
    }
}

export default withStyles(styles as any)(SharedWorkspaces)
