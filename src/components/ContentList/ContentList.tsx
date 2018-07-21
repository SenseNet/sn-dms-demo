
import CircularProgress from '@material-ui/core/CircularProgress'
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
import ListHead from './ListHead'
import SimpleTableRow from './SimpleTableRow'

import { IContent } from '@sensenet/client-core'
import { File as SnFile, Folder, GenericContent } from '@sensenet/default-content-types'
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
        rootId: state.dms.rootId,
        selected: Reducers.getSelectedContentIds(state.sensenet),
        isFetching: Reducers.getFetching(state.sensenet.children),
        isLoading: DMSReducers.getLoading(state.dms),
        edited: DMSReducers.getEditedItemId(state.dms),
    }
}

const mapDispatchToProps = {
    loadContent: Actions.loadContent,
    select: Actions.selectContent,
    deselect: Actions.deSelectContent,
    clearSelection: Actions.clearSelection,
    deleteBatch: Actions.deleteBatch,
    selectionModeOn: DMSActions.selectionModeOn,
    selectionModeOff: DMSActions.selectionModeOff,
    openViewer: DMSActions.openViewer,
    pollDocumentData,
}

interface ContentListProps extends RouteComponentProps<any> {
    contentList: Array<SnFile | Folder>
    connectDropTarget,
    hostName: string
}

interface ContentListState {
    order,
    orderBy,
    selected,
    active,
    copy,
}

@DropTarget((props) => props.accepts, DragAndDrop.uploadTarget, (conn, monitor) => ({
    connectDropTarget: conn.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
class ContentList extends React.Component<ContentListProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, ContentListState> {
    constructor(props) {
        super(props)
        this.state = {
            order: 'desc',
            orderBy: 'IsFolder',
            selected: [],
            active: null,
            copy: false,
        }
        this.handleRowSingleClick = this.handleRowSingleClick.bind(this)
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleTap = this.handleTap.bind(this)
    }

    public componentDidUpdate(prevOps) {
        if (this.props.selected.length > 0 && !prevOps.selectionModeIsOn) {
            this.props.selectionModeOn()
        } else if (this.props.selected.length === 0 && prevOps.selectionModeIsOn) {
            this.props.selectionModeOff()
        }
    }

    public handleRowSingleClick(e: React.MouseEvent, content: GenericContent) {
        const { contentList, selected } = this.props
        if (e.shiftKey) {
            e.preventDefault()
            const from = contentList.findIndex((c) => c.Id === selected[selected.length - 1])
            const till = contentList.findIndex((c) => c.Id === Number(e.currentTarget.closest('tr').id))
            if (from < till) {
                contentList.map((c, i) => {
                    if (i > from && i < till + 1) {
                        this.handleSimpleSelection(c)
                    }
                })
            } else {
                for (let i = contentList.length - 1; i > -1; i--) {
                    if (i < from && i > till - 1) {
                        this.handleSimpleSelection(this.props.contentList[i])
                    }
                }
            }
        } else if (e.ctrlKey) {
            this.handleSimpleSelection(content)
        } else {
            e.currentTarget.getAttribute('type') !== 'checkbox' && window.innerWidth >= 700 ?
                this.handleSingleSelection(content) :
                this.handleSimpleSelection(content)
        }
    }
    public handleRowDoubleClick(e: React.MouseEvent, c: GenericContent) {
        if (c.Type === 'Folder') {
            const newPath = compile(this.props.match.path)({ folderId: c.Id })
            this.props.history.push(newPath)
            this.props.loadContent(c.Id)
            this.props.deselect(c)
        } else {
            // console.log('open preview')
            this.props.openViewer(c.Id)
            this.props.pollDocumentData(this.props.hostName, c.Id)

        }
    }
    public handleKeyDown(e) {
        const ctrl = e.ctrlKey ? true : false
        const shift = e.shiftKey ? true : false
        const { contentList } = this.props

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
                const content = contentList.find((i) => i.Id === id)
                this.setState({
                    active: id,
                })
                switch (e.which) {
                    case Key.Space:
                        e.preventDefault()
                        this.handleSimpleSelection(contentList.find((i) => i.Id === id))
                        break
                    case Key.Enter:
                        e.preventDefault()
                        this.handleRowDoubleClick(e, content)
                        break
                    case Key.UpArrow:
                        if (shift) {
                            const upperItemIndex = contentList.findIndex((c) => c.Id === Number(this.state.active)) - 1
                            upperItemIndex > -1 ?
                                this.handleSimpleSelection(contentList[upperItemIndex]) :
                                // tslint:disable-next-line:no-unused-expression
                                null
                        }
                        break
                    case Key.DownArrow:
                        if (shift) {
                            const upperItemIndex = contentList.findIndex((c) => c.Id === Number(this.state.active)) + 1
                            upperItemIndex < contentList.length ?
                                this.handleSimpleSelection(contentList[upperItemIndex]) :
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
    public handleSimpleSelection(content: IContent) {
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
    }
    public handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.props.contentList.map((a) => a.Id) })
            this.props.contentList.map((c) => this.props.selected.indexOf(c.Id) > -1 ? null : this.props.select(c))
            return
        }
        this.setState({ selected: [] })
        this.props.contentList.map((c) => { this.props.deselect(c) })
    }
    public handleTap(e: React.SyntheticEvent, c: GenericContent) {
        if (c.Type === 'Folder') {
            this.props.history.push(`/${c.Id}`)
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
                <Table
                    onKeyDown={(event) => this.handleKeyDown(event)}
                    onKeyUp={(event) => this.handleKeyUp(event)}>
                    <MediaQuery minDeviceWidth={700}>
                        <ListHead
                            numSelected={this.state.selected.length}
                            order={this.state.order}
                            orderBy={this.state.orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            count={this.props.contentList.length}
                        />
                    </MediaQuery>
                    <TableBody style={styles.tableBody}>
                        {this.props.isFetching || this.props.isLoading ?
                            <tr>
                                <td colSpan={5} style={styles.loader}>
                                    <CircularProgress color="secondary" size={50} />
                                </td>
                            </tr>
                            : this.props.contentList.map((content) => {
                                return (
                                    <SimpleTableRow
                                        content={content}
                                        key={content.Id}
                                        handleRowDoubleClick={this.handleRowDoubleClick}
                                        handleRowSingleClick={this.handleRowSingleClick}
                                        handleTap={this.handleTap}
                                        isCopy={this.state.copy} />
                                )
                            })
                        }

                    </TableBody>
                </Table>
                <ActionMenu id={this.props.selected.Id} />
                {/* <SelectionBox /> */}
            </div>)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentList))
