import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Icon } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import { resources } from '../../assets/resources'

const styles = {
    appbar: {
        background: 'transparent',
        boxShadow: 'none',
        padding: '0 12px',
        borderBottom: 'solid 1px #fff',
    },
    toolbar: {
        padding: 0,
        minHeight: 36,
    },
    toolbarAdmin: {
        padding: 0,
        minHeight: 64,
    },
    title: {
        flexGrow: 1,
        color: '#666',
        fontFamily: 'Raleway SemiBold',
        fontSize: 18,
        textTransform: 'uppercase',
        alignSelf: 'flex-end',
        marginBottom: 5,
    },
    button: {
        fontSize: 15,
        fontFamily: 'Raleway SemiBold',
    },
    buttonRaised: {
        fontSize: 14,
        fontFamily: 'Raleway ExtraBold',
        marginRight: 10,
    },
    icon: {
        marginRight: 5,
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        isAdmin: state.dms.usersAndGroups.user.isAdmin,
    }
}

const mapDispatchToProps = {
}

class GroupListToolbar extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public render() {
        return (
            <AppBar position="static" style={styles.appbar}>
                <Toolbar style={this.props.isAdmin ? styles.toolbarAdmin : styles.toolbar}>
                    <Typography variant="title" color="inherit" noWrap style={styles.title as any}>
                        {resources.GROUPS}
                    </Typography>
                    {this.props.isAdmin ? <div>
                        <Button variant="raised" color="primary" style={{ ...styles.button, ...styles.buttonRaised }}>
                            <Icon iconName="add" style={{ ...styles.icon, ...{ color: '#fff' } }} />
                            {resources.ADD_TO_GROUP}
                        </Button>
                        <Button color="primary" style={styles.button}>
                            <Icon iconName="delete" style={styles.icon} />
                            {resources.REMOVE_FROM_SELECTED_GROUPS}
                        </Button>
                    </div> : null}
                </Toolbar>
            </AppBar>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupListToolbar)
