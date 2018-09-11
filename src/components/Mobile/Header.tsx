import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import PlusIcon from '@material-ui/icons/Add'
import MenuIcon from '@material-ui/icons/Menu'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import AppBarLogo from '../AppBarLogo'
import { QuickSearch } from '../QuickSearch'

const styles = {
    appBar: {
        background: '#4cc9f2',
        zIndex: 1210,
        boxShadow: 'none',
    },
    menuButton: {
        marginLeft: -12,
        height: 36,
    },
    plusButton: {
        height: 36,
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        menuIsOpen: state.dms.menuOpen,
    }
}

const mapDispatchToProps = {
    openMenu: DMSActions.handleDrawerMenu,
}

interface MobileHeaderState {
    open: boolean,
}

class MobileHeader extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, MobileHeaderState> {
    public state = {
        open: this.props.menuIsOpen,
    }
    public handleClick = () => {
        this.props.openMenu(!this.props.menuIsOpen)
        this.setState({
            open: !this.state.open,
        })
    }
    public render() {
        return (
            <AppBar position="absolute" style={styles.appBar}>
                <Toolbar style={{ minHeight: 36, padding: '0px 0px 0px 10px' }}>
                    <IconButton
                        style={styles.menuButton}
                        color="inherit"
                        aria-label="Menu"
                        onClick={() => this.handleClick()}>
                        <MenuIcon />
                    </IconButton>
                    <AppBarLogo />
                    <div>
                        <QuickSearch />
                        <IconButton style={styles.plusButton} color="inherit" aria-label="Add new">
                            <PlusIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader)
