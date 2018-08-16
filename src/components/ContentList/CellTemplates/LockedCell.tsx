import { Icon, TableCell } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../../..'

const styles = {
    cell: {
        width: 100,
    },
    lockedCellContainer: {
        textAlign: 'center',
    },
    userName: {
        fontFamily: 'Raleway Semibold',
        fontStyle: 'italic',
        fontSize: 11,
        display: 'block',
    },
    icon: {
        display: 'block',
        fontSize: 20,
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        currentUserName: state.sensenet.session.user.userName,
    }
}

export interface LockedCellProps {
    content: GenericContent,
    fieldName: string,
}

class LockedCell extends React.Component<LockedCellProps & ReturnType<typeof mapStateToProps>, {}> {
    public lockedByName = (content) => {
        // tslint:disable-next-line:no-string-literal
        if (content['CheckedOutTo'].Name === this.props.currentUserName) {
            return 'Me'
        } else {
            // tslint:disable-next-line:no-string-literal
            return content['CheckedOutTo'].FullName
        }
    }
    public render() {
        const { content } = this.props
        return (
            <TableCell padding="checkbox" style={styles.cell}>
                {content.Locked ?
                    <div style={styles.lockedCellContainer as any}>
                        <span style={styles.userName}>{this.lockedByName(content)}</span>
                        <span style={styles.icon}><Icon style={{ fontSize: 20 }}>lock</Icon></span>
                    </div> :
                    null
                }
            </TableCell>
        )
    }
}

export default connect(mapStateToProps, {})(LockedCell)
