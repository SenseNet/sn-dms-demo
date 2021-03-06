import Button from '@material-ui/core/Button'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import {
    withRouter,
} from 'react-router-dom'
import * as DMSActions from '../Actions'

const styles = {
    actionButton: {
        color: '#fff',
        position: 'fixed' as any,
        bottom: 10,
        right: 10,
    },
}

interface FloatingActionButton {
    actionMenuIsOpen: boolean,
    content: GenericContent,
    actions,
    openActionMenu,
    closeActionMenu,
    getActions,
}

class FloatingActionButton extends React.Component<FloatingActionButton, { color }> {
    constructor(props) {
        super(props)
        this.state = {
            color: 'secondary',
        }
    }
    public handleActionMenuClick(e) {
        const { content, actions } = this.props
        this.props.closeActionMenu()
        this.props.getActions(content.Id, 'New', [{ DisplayName: 'Upload document', Name: 'Upload', Icon: 'upload', CssClass: 'borderTop' }])
        this.props.openActionMenu(actions, content.Id, content.DisplayName, { top: e.clientY - 300, left: e.clientX - 220 })
        this.setState({
            color: 'primary',
        })
    }
    public render() {
        return (
            <Button variant="fab" color={this.state.color} aria-label="add" style={styles.actionButton as any}
                onClick={(event) => this.handleActionMenuClick(event)} >
                <Icon type={iconType.materialui} iconName="add" />
            </Button>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        actions: state.dms.actionmenu.actions,
    }
}
export default withRouter(connect(mapStateToProps, {
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
    getActions: Actions.loadContentActions,
})(FloatingActionButton))
