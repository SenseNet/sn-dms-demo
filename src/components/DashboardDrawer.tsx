import { Theme, withStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import * as React from 'react'

const drawerWidth = 240

const styles = (theme) => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
})

interface DashboarDrawerProps {
    classes: {
        drawerPaper: string;
    }
}

class DashboardDrawer extends React.Component<DashboarDrawerProps, {}> {
    public render() {
        const { classes } = this.props
        return <Drawer
            variant="permanent"
            open={true}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div style={{ height: 48 }}></div>
            <div style={{ padding: 10, fontSize: 14, color: '#666' }}>
                {/* upload button helye
        add button helye */}
                <List>
                    <li>
                        <Divider />
                    </li>
                    <ListItem style={{ padding: '20px 10px' }}>
                        <ListItemIcon>
                            <Icon color="primary">people</Icon>
                        </ListItemIcon>
                        Shared with me
        </ListItem>
                    <li>
                        <Divider />
                    </li>
                    <ListItem style={{ padding: '20px 10px' }}>
                        <ListItemIcon>
                            <Icon color="primary">star</Icon>
                        </ListItemIcon>
                        Saved searches
            </ListItem>
                    <li>
                        <Divider />
                    </li>
                    <ListItem style={{ padding: '20px 10px' }}>
                        <ListItemIcon>
                            <Icon color="primary">delete</Icon>
                        </ListItemIcon>
                        Trash
            </ListItem>
                    <li>
                        <Divider />
                    </li>
                </List>
            </div>
        </Drawer>
    }
}

export default withStyles(styles as any)(DashboardDrawer)
