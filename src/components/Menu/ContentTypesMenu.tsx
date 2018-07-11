import { Icon, ListItemText, MenuItem, StyleRulesCallback, withStyles } from '@material-ui/core'
import * as React from 'react'

const styles: StyleRulesCallback = (theme) => ({
    primary: {
        color: '#666',
        fontFamily: 'Raleway Semibold',
        fontSize: '14px',
    },
    primaryActive: {
        color: '#016d9e',
        fontFamily: 'Raleway Semibold',
        fontSize: '14px',
    },
    iconWhite: {
        color: '#fff',
        background: '#666',
        borderRadius: '50%',
        fontSize: '14px',
        padding: 4,
    },
    iconWhiteActive: {
        color: '#fff',
        background: '#016d9e',
        borderRadius: '50%',
        fontSize: '14px',
        padding: 4,
    },
    root: {
        color: '#666',
        paddingLeft: 0,
        paddingRight: 0,
    },
    selected: {
        backgroundColor: '#fff !important',
        color: '#016d9e',
        fontWeight: 600,
        paddingLeft: 0,
        paddingRight: 0,
    },
})

class ContentTypesMenu extends React.Component<{ active, classes }, {}> {
    public render() {
        const { active, classes } = this.props
        return (
            <MenuItem selected={active} classes={{ root: classes.root, selected: classes.selected }}>
                <Icon className={active ? classes.iconWhiteActive : classes.iconWhite} color="primary">
                    edit
                        </Icon>
                <ListItemText classes={{ primary: active ? classes.primaryActive : classes.primary }} inset primary="Content Types" />
            </MenuItem>
        )
    }
}

export default withStyles(styles)(ContentTypesMenu)
