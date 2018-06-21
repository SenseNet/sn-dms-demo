import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import MoreVert from '@material-ui/icons/MoreVert'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../../Actions'
import * as DMSReducers from '../../../Reducers'

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer' as any,
    },
    icon: {
        verticalAlign: 'middle' as any,
        opacity: 0,
    },
    selectedIcon: {
        verticalAlign: 'middle' as any,
    },
    hoveredIcon: {
        verticalAlign: 'middle' as any,
    },
}

interface MenuCellProps {
    content,
    actions,
    isHovered: boolean,
    isSelected: boolean,
    openActionMenu,
    closeActionMenu,
    actionMenuIsOpen: boolean,
    selectionModeOn: boolean
}
interface MenuCellState {
    anchorTop,
    anchorLeft
}

class MenuCell extends React.Component<MenuCellProps, MenuCellState> {
    constructor(props) {
        super(props)
        this.state = {
            anchorLeft: 0,
            anchorTop: 0,
        }
        this.handleActionMenuClick = this.handleActionMenuClick.bind(this)
    }
    public handleActionMenuClick(e, content) {
        const top = e.pageY - e.target.offsetTop
        const left = e.pageX - e.target.offsetLeft
        this.props.closeActionMenu()
        this.setState({ anchorTop: e.clientY, anchorLeft: e.clientX })
        this.props.openActionMenu(content.Actions, content.Id, content.DisplayName, e.currentTarget,
            {
                top: e.currentTarget.offsetTop + 40,
                left: e.currentTarget.offsetLeft,
            })
    }
    public render() {
        const { isSelected, isHovered, content, actionMenuIsOpen, selectionModeOn } = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    const padding = matches ? 'none' : 'checkbox'
                    return <TableCell style={styles.actionMenuButton}
                        padding={padding}>
                        <IconButton
                            aria-label="Menu"
                            aria-owns="actionmenu"
                            onClick={(event) => !selectionModeOn ? this.handleActionMenuClick(event, content) : null}
                        >
                            <MoreVert style={
                                isHovered && !selectionModeOn ? styles.hoveredIcon : styles.icon &&
                                    isSelected && !selectionModeOn ? styles.selectedIcon : styles.icon
                            } />
                        </IconButton>
                    </TableCell>
                }}
            </MediaQuery>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContentIds(state.sensenet),
        opened: Reducers.getOpenedContent(state.sensenet.children),
        actions: DMSReducers.getActionsOfAContent(state.sensenet.children.entities[match.content.Id]),
        selectionModeOn: DMSReducers.getIsSelectionModeOn(state.dms),
    }
}
export default connect(mapStateToProps, {
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
})(MenuCell)
