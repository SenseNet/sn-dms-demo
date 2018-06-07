import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import AppBarLogo from '../components/AppBarLogo'
import { QuickSearch } from '../components/QuickSearch'
import UserActionMenu from '../components/UserActionMenu'

const styles = {
    appBar: {
        background: '#4cc9f2',
        borderBottom: 'solid 1px #f5f5f5',
    },
}

class Header extends React.Component<{}, {}> {
    public render() {
        return (
            <AppBar position="static" style={styles.appBar}>
                <Toolbar style={{ minHeight: 48, padding: '0px 10px' }}>
                    <AppBarLogo history />
                    <QuickSearch />
                    <UserActionMenu />
                </Toolbar>
            </AppBar>
        )
    }
}

export default Header
