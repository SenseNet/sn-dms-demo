import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { Icon } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '../../..'
import { resources } from '../../../assets/resources'
import GroupDropDown from './GroupDropDown'

const styles = {
    button: {
        fontSize: 15,
        fontFamily: 'Raleway SemiBold',
    },
    buttonRaised: {
        fontSize: 14,
        fontFamily: 'Raleway ExtraBold',
        marginRight: 10,
    },
    activeButtonMobile: {

    },
    icon: {
        marginRight: 5,
    },
}

interface GroupSelectorState {
    open: boolean,
}

const mapStateToProps = (state: rootStateType) => {
    return {
    }
}

class GroupSelector extends React.Component<ReturnType<typeof mapStateToProps>, GroupSelectorState> {
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
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return <ClickAwayListener onClickAway={this.handleButtonClick}>
                    <div style={{ display: 'inline' }}>
                        <Button
                            variant="raised" color="primary" style={{ ...styles.button, ...styles.buttonRaised }}
                            onClick={() => this.handleButtonClick(open)}>
                            <Icon iconName="add" style={{ ...styles.icon, ...{ color: '#fff' } }} />
                            {resources.ADD_TO_GROUP}
                        </Button>
                        <GroupDropDown matches={matches} open={open} closeDropDown={this.handleButtonClick} />
                    </div>
                </ClickAwayListener>
            }}
        </MediaQuery>
    }

}

export default connect(mapStateToProps, {})(GroupSelector)
