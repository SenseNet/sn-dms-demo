import { Button, TableCell } from '@material-ui/core'
import { Icon } from '@sensenet/icons-react'
import * as React from 'react'
import { resources } from '../../assets/resources'

const styles = {
    cell: {
        width: 225,
    },
    button: {
        fontFamily: 'Raleway Medium',
        fontSize: 15,
    },
}

export class DeleteUserFromGroup extends React.Component<{}, {}> {
    public render() {
        return (
            <TableCell padding="checkbox" style={styles.cell as any}>
                <Button style={styles.button}>
                    <Icon iconName="delete" style={{ fontSize: 19, marginRight: 10 }} />
                    {resources.DELETE_FROM_GROUP}
                </Button>
            </TableCell>
        )
    }
}
