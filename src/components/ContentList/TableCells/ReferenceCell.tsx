import TableCell from '@material-ui/core/TableCell'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { DragSource } from 'react-dnd'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import * as DragAndDrop from '../../../DragAndDrop'

const styles = {
    cellPadding: {
        padding: '16px 24px',
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
    optionName
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
        const { content, handleRowSingleClick, handleRowDoubleClick, connectDragSource, connectDropTarget, isCopy, fieldName, optionName } = this.props
        const dropEffect = isCopy ? 'copy' : 'move'
        const isVmi = true
        return (
            <TableCell
                padding="none"
                onClick={(event) => handleRowSingleClick(event, content.Id)}
                onDoubleClick={(event) => handleRowDoubleClick(event, content.Id)}>
                {!isVmi ? null : connectDragSource(connectDropTarget(<div style={styles.cellPadding}>
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
