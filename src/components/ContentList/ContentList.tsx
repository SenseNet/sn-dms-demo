
import LinearProgress from '@material-ui/core/LinearProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import { pollDocumentData } from '@sensenet/document-viewer-react'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps } from 'react-router'
import {
    withRouter,
} from 'react-router-dom'
import { Key } from 'ts-keycode-enum'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import * as DragAndDrop from '../../DragAndDrop'
import * as DMSReducers from '../../Reducers'
import ActionMenu from '../ActionMenu/ActionMenu'
import ListHead, { HeaderColumnData } from './ListHead'
import SimpleTableRow from './SimpleTableRow'

import { compile } from 'path-to-regexp'

const styles = {
    paper: {
        width: '100%',
        overflow: 'hidden' as any,
    },
    tableBody: {
        background: '#fff',
    },
    loader: {
        textAlign: 'center' as any,
        padding: 60,
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        ids: Reducers.getIds(state.sensenet.currentitems),
        rootId: state.dms.rootId,
        selected: Reducers.getSelectedContentIds(state.sensenet),
        selectedContentItems: Reducers.getSelectedContentItems(state.sensenet),
        isFetching: Reducers.getFetching(state.sensenet.currentitems),
        isLoading: DMSReducers.getLoading(state.dms),
        edited: DMSReducers.getEditedItemId(state.dms),
        selectionModeIsOn: DMSReducers.getIsSelectionModeOn(state.dms),
        menuId: DMSReducers.getMenuAnchorId(state.dms),
        currentItems: state.sensenet.currentitems.entities,
        currentODataOptions: state.sensenet.currentitems.options,
    }
}

const mapDispatchToProps = {
    loadContent: Actions.loadContent,
    select: Actions.selectContent,
    deselect: Actions.deSelectContent,
    clearSelection: Actions.clearSelection,
    delete: Actions.deleteContent,
    deleteBatch: Actions.deleteBatch,
    copyBatch: Actions.copyBatch,
    moveBatch: Actions.moveBatch,
    selectionModeOn: DMSActions.selectionModeOn,
    selectionModeOff: DMSActions.selectionModeOff,
    openViewer: DMSActions.openViewer,
    pollDocumentData,
    setDefaultOdataOptions: Actions.setDefaultOdataOptions,
}

interface ContentListProps extends RouteComponentProps<any> {
    connectDropTarget,
    hostName: string
    headerColumnData: HeaderColumnData[]
}

interface ContentListState {
    ids,
    order,
    orderBy,
    data,
    selected,
    active,
    copy,
}

@DropTarget((props) => props.accepts, DragAndDrop.uploadTarget, (conn, monitor) => ({
    connectDropTarget: conn.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
class ContentList extends React.Component<ContentListProps & RouteComponentProps<any> & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, ContentListState> {

    public static getDerivedStateFromProps: React.GetDerivedStateFromProps<ContentList['props'], ContentListState> = (nextProps, lastState) => {
        return {
            ...lastState,
            orderBy: nextProps.currentODataOptions.orderby[0][0],
            order: nextProps.currentODataOptions.orderby[0][1],
            ids: nextProps.ids,
            data: nextProps.children,
            selected: (lastState && lastState.selected) || [],
            active: (lastState && lastState.active) || null,
            copy: (lastState && lastState.copy) || false,
        }
    }

    constructor(props) {
        super(props)
        this.handleRowSingleClick = this.handleRowSingleClick.bind(this)
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleTap = this.handleTap.bind(this)
    }

    public componentDidUpdate(prevOps) {
        if (this.props.edited !== prevOps.edited) {
            this.setState({
                data: this.props.children,
            })
        }

        if (this.props.selected.length > 0 && !prevOps.selectionModeIsOn) {
            this.props.selectionModeOn()
        } else if (this.props.selected.length === 0 && prevOps.selectionModeIsOn) {
            this.props.selectionModeOff()
        }
    }

    public handleRowSingleClick(e, content, m) {
        const { ids, selected } = this.props
        if (e.shiftKey) {
            e.preventDefault()
            const from = ids.indexOf(selected[selected.length - 1])
            const till = ids.indexOf(Number(e.target.closest('tr').id))
            if (from < till) {
                ids.map((elId, i) => {
                    if (i > from && i < till + 1) {
                        this.handleSimpleSelection(this.props.currentItems.find((c) => c.Id === elId))
                    }
                })
            } else {
                for (let i = ids.length - 1; i > -1; i--) {
                    if (i < from && i > till - 1) {
                        this.handleSimpleSelection(this.props.currentItems.find((c) => c.Id === ids[i]))
                    }
                }
            }
        } else if (e.ctrlKey) {
            this.handleSimpleSelection(content)
        } else {
            e.target.getAttribute('type') !== 'checkbox' && window.innerWidth >= 700 ?
                this.handleSingleSelection(content) :
                this.handleSimpleSelection(content)
        }
    }
    public handleRowDoubleClick(e, id, type) {
        if (type === 'Folder') {
            const newPath = compile(this.props.match.path)({ scope: 'documents', contentId: id })
            this.props.history.push(newPath)
            this.props.loadContent(id)
            this.props.deselect(this.props.currentItems.find((c) => c.Id === id))
        } else {
            // console.log('open preview')
            this.props.openViewer(id)
            this.props.pollDocumentData(this.props.hostName, id)

        }
    }
    public handleKeyDown(e) {
        const ctrl = e.ctrlKey ? true : false
        const shift = e.shiftKey ? true : false
        const { currentItems, ids } = this.props

        if (ctrl) {
            this.setState({
                copy: true,
            })
        }

        if (e.target.getAttribute('type') === 'text') {
            return null
        } else {
            const id = Number(e.target.closest('tr').id)
            if (id !== 0) {
                const type = currentItems.find((c) => c.Id === id).Type
                this.setState({
                    active: id,
                })
                switch (e.which) {
                    case Key.Space:
                        e.preventDefault()
                        this.handleSimpleSelection(currentItems.find((c) => c.Id === id))
                        break
                    case Key.Enter:
                        e.preventDefault()
                        this.handleRowDoubleClick(e, id, type)
                        break
                    case Key.UpArrow:
                        if (shift) {
                            const upperItemIndex = ids.indexOf(Number(this.state.active)) - 1
                            upperItemIndex > -1 ?
                                this.handleSimpleSelection(currentItems.find((c) => c.Id === ids[upperItemIndex])) :
                                // tslint:disable-next-line:no-unused-expression
                                null
                        }
                        break
                    case Key.DownArrow:
                        if (shift) {
                            const upperItemIndex = ids.indexOf(Number(this.state.active)) + 1
                            upperItemIndex < ids.length ?
                                this.handleSimpleSelection(currentItems.find((c) => c.Id === ids[upperItemIndex])) :
                                // tslint:disable-next-line:no-unused-expression
                                null
                        }
                        break
                    case Key.Delete:
                        const permanent = shift ? true : false
                        if (this.props.selected.length > 0) {
                            this.props.deleteBatch(this.props.selected, permanent)
                            this.props.clearSelection()
                        }
                        break
                    case Key.A:
                        if (ctrl) {
                            e.preventDefault()
                            this.handleSelectAllClick(e, true)
                        }
                        break
                    default:
                        break
                }
            }
        }
    }
    public handleKeyUp(e) {
        const ctrl = e.ctrlKey ? true : false
        if (!ctrl) {
            this.setState({
                copy: false,
            })
        }
    }
    public handleSimpleSelection(content) {
        this.props.selected.indexOf(content.Id) > -1 ?
            this.props.deselect(content) :
            this.props.select(content)

        const { selected } = this.state
        const selectedIndex = selected.indexOf(content.Id)
        let newSelected = []
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, content.Id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }

        this.setState({ selected: newSelected, active: content.Id })
    }
    public handleSingleSelection(content) {
        this.props.clearSelection()
        this.props.select(content)
        this.setState({ selected: [content.Id], active: content.Id })
    }
    public handleRequestSort = (event, property) => {
        // TODO: implement sorting
        this.props.setDefaultOdataOptions({
            ...this.props.currentODataOptions,
            orderby: [[property, this.props.currentODataOptions.orderby[0][1] === 'asc' ? 'desc' : 'asc']],
        })
    }
    public handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.props.ids })
            this.props.ids.map((id) => this.props.selected.indexOf(id) > -1 ? null : this.props.select(this.props.currentItems.find((c) => c.Id === id)))
            return
        }
        this.setState({ selected: [] })
        this.props.ids.map((id) => { this.props.deselect(this.props.currentItems.find((c) => c.Id === id)) })
    }
    public handleTap(e, id, type) {
        if (type === 'Folder') {
            this.props.history.push(`/${id}`)
        } else {
            console.log('open preview')
        }
    }
    public isChildrenFolder() {
        const urlArray = location.href.split('/')
        const id = parseInt(urlArray[urlArray.length - 1], 10)
        return !isNaN(id) && isFinite(id) && id !== this.props.rootId
    }
    public render() {
        const { connectDropTarget } = this.props
        return connectDropTarget(
            <div>
                {this.props.isFetching || this.props.isLoading || this.props.currentItems.entities === null ?
                    <LinearProgress color="secondary" style={{ position: 'absolute', width: '100%' }} />
                    : null}
                <Table
                    onKeyDown={(event) => this.handleKeyDown(event)}
                    onKeyUp={(event) => this.handleKeyUp(event)}>
                    <MediaQuery minDeviceWidth={700}>
                        <ListHead
                            headerColumnData={this.props.headerColumnData}
                            numSelected={this.state.selected.length}
                            order={this.state.order}
                            orderBy={this.state.orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={(event, property) => this.handleRequestSort(event, property)}
                            count={this.props.ids.length}
                        />
                    </MediaQuery>
                    <TableBody style={styles.tableBody}>
                        {this.props.currentItems.map((content) => {
                            return typeof content !== 'undefined' ? (
                                <SimpleTableRow
                                    content={content}
                                    key={content.Id}
                                    handleRowDoubleClick={this.handleRowDoubleClick}
                                    handleRowSingleClick={this.handleRowSingleClick}
                                    handleTap={(e) => this.handleTap(e, content.Id, content.Type)}
                                    isCopy={this.state.copy} />
                            ) : null
                        })
                        }

                    </TableBody>
                </Table>
                <ActionMenu id={this.props.menuId} />
                {/* <SelectionBox /> */}
            </div>)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentList))
