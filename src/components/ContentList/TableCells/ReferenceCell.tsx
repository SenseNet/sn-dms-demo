import TableCell from '@material-ui/core/TableCell'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { DragSource } from 'react-dnd'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import * as DragAndDrop from '../../../DragAndDrop'

const styles = {
    selected: {
        color: '#016D9E',
        fontFamily: 'Raleway SemiBold',
    },
    tableCell: {
        fontSize: 16,
    },
    hoveredCell: {
        fontFamily: 'Raleway Semibold',
        cursor: 'pointer' as any,
        fontSize: 16,
        fontWeight: 'normal',
    },
}

interface ReferenceCellProps {
    content,
    handleRowSingleClick,
    handleRowDoubleClick,
    connectDragSource,
    connectDropTarget,
    isCopy,
    fieldName,
    optionName,
    isSelected,
    isHovered
}

@DropTarget('row', DragAndDrop.rowTarget, (conn, monitor) => ({
    connectDropTarget: conn.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
@DragSource('row', DragAndDrop.rowSource, DragAndDrop.collect)
class ReferenceCell extends React.Component<ReferenceCellProps, {}> {
    constructor(props) {
        super(props)
    }
    public render() {
        const { content, handleRowSingleClick, handleRowDoubleClick, connectDragSource, connectDropTarget, isCopy, fieldName, optionName, isSelected, isHovered } = this.props
        const dropEffect = isCopy ? 'copy' : 'move'
        const isVmi = true
        let style
        if (isHovered) {
            style = { ...styles.hoveredCell, ...styles.tableCell }
        } else if (isSelected) {
            style = { ...styles.selected, ...styles.tableCell }
        } else {
            style = {...styles.tableCell}
        }
        return (
            <TableCell
                padding="none"
                onClick={(event) => handleRowSingleClick(event, content.Id)}
                onDoubleClick={(event) => handleRowDoubleClick(event, content.Id)}>
                {!isVmi ? null : connectDragSource(connectDropTarget(<div style={style}>
                    {content[fieldName][optionName]}
                </div>,
                ), { dropEffect })}
            </TableCell>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContentIds(state.sensenet),
        selectedContentItems: Reducers.getSelectedContentItems(state.sensenet),
    }
}

export default connect(mapStateToProps, {
})(ReferenceCell)
