import Button from '@material-ui/core/Button'
import * as React from 'react'
import * as FontAwesome from 'react-fontawesome'

import '../../assets/css/font-awesome.min.css'
import WorkspaceDropDown from './WorkspaceDropDown'

const styles = {
    button: {
        background: '#777',
        color: '#fff',
        boxShadow: '#cacaca 0px 2px 2px',
        minWidth: 60,
        borderRadius: 2,
    },
    activeButton: {
        background: '#016d9e',
    },
}

interface WorkspaceSelectorState {
    open: boolean,
}

export class WorkspaceSelector extends React.Component<{}, WorkspaceSelectorState> {
    public state = {
        open: false,
    }
    public handleButtonClick = (open) => {
        this.setState({
            open: open ? false : !this.state.open,
        })
    }
    public render() {
        const { open } = this.state
        return (
            <div style={{ flex: '0 1 auto' }}>
                <Button
                style={open ? {...styles.button, ...styles.activeButton} : styles.button}
                onClick={() => this.handleButtonClick(this.state.open)}>
                    <FontAwesome name="sitemap" />
                </Button>
                <WorkspaceDropDown open={this.state.open} closeDropDown={this.handleButtonClick} />
            </div>
        )
    }
}
