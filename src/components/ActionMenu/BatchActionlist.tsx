import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import * as React from 'react'

import { icons } from '../../assets/icons'

const styles = {
    icon: {},
}

export class BatchActionlist extends React.Component<{ actions: any[] }, {}> {
    public render() {
        const { actions } = this.props
        return (
            <ul>
                {actions.map((action) => {
                    return <li>
                        <IconButton aria-label={action.DisplayName}>
                            <Icon color="primary" style={styles.icon}>{icons[action.Icon.toLowerCase()]}</Icon>
                        </IconButton>
                    </li>
                })}
            </ul>
        )
    }
}
