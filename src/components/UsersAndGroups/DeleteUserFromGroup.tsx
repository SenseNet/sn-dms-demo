import { Button, TableCell } from '@material-ui/core'
import { GenericContent, User } from '@sensenet/default-content-types'
import { Icon } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import { resources } from '../../assets/resources'
import * as Actions from '../../store/usersandgroups/actions'

const styles = {
    cell: {
        width: 225,
    },
    button: {
        fontFamily: 'Raleway Medium',
        fontSize: 15,
    },
}

// tslint:disable-next-line:no-empty-interface
interface DeleteUserFromGroupProps {
    user: User,
    group: GenericContent,
}

// tslint:disable-next-line:no-empty-interface
interface DeleteUserFromGroupState { }

const mapStateToProps = (state: rootStateType) => {
    return {
    }
}

const mapDispatchToProps = {
    removeMembersFromGroup: Actions.removeMemberFromGroup,
}

class DeleteUserFromGroup extends React.Component<DeleteUserFromGroupProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DeleteUserFromGroupState> {
    public handleClick = () => {
        const { user, group, removeMembersFromGroup } = this.props
        removeMembersFromGroup([user.Id], group.Id)
    }
    public render() {
        return (
            <TableCell padding="checkbox" style={styles.cell as any}>
                <Button style={styles.button} onClick={() => this.handleClick()}>
                    <Icon iconName="delete" style={{ fontSize: 19, marginRight: 10 }} />
                    {resources.DELETE_FROM_GROUP}
                </Button>
            </TableCell>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteUserFromGroup)
