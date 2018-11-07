import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import AppBarLogo from './AppBarLogo'
import { QuickSearch } from './QuickSearch'
import UserActionMenu from './UserActionMenu'

const styles = {
    appBar: {
        background: 'transparent',
        zIndex: 1210,
        height: 48,
        borderBottom: '1px solid #ddd',
    },
}

class Header extends React.Component<{}, {}> {
    public render() {
        return (
            <AppBar position="absolute" style={{ ...styles.appBar, boxShadow: 'none' }}>
                <Toolbar style={{ minHeight: 48, padding: '0px 10px', display: 'flex' }}>
                    <AppBarLogo style={{
                        width: '196px',
                        flexGrow: 0,
                        flexShrink: 0,
                        fontSize: '1.4em',
                    }} />
                    <QuickSearch style={{
                        flexGrow: 1,
                    }} />
                    <UserActionMenu style={{
                        flexGrow: 0,
                    }} />
                </Toolbar>
            </AppBar>
        )
    }
}

export default Header
