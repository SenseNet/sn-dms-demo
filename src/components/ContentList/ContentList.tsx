
import LinearProgress from '@material-ui/core/LinearProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import * as React from 'react'
import MediaQuery from 'react-responsive'
import { Key } from 'ts-keycode-enum'
import ListHead, { HeaderColumnData } from './ListHead'
// import SimpleTableRow from './SimpleTableRow'

import { IODataCollectionResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

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

interface ContentListProps {
    items: IODataCollectionResponse<GenericContent>
    onDoubleClick: (e: React.MouseEvent, content: GenericContent) => any
    onTap: (e: React.MouseEvent, content: GenericContent) => any
    headerColumnData: HeaderColumnData[]
    isLoading: boolean
}

interface ContentListState {
    // order,
    // orderBy,
    selected: GenericContent[]
    selectionModeEnabled: boolean
    active: GenericContent,
    copy,
}

// @DropTarget((props) => props.accepts, DragAndDrop.uploadTarget, (conn, monitor) => ({
//     connectDropTarget: conn.dropTarget(),
//     isOver: monitor.isOver(),
//     canDrop: monitor.canDrop(),
// }))
class ContentList extends React.Component<ContentListProps, ContentListState> {

    public state: ContentListState = {
        active: null,
        copy: false,
        selectionModeEnabled: false,
        selected: [],
    }

    // public static getDerivedStateFromProps: React.GetDerivedStateFromProps<ContentList['props'], ContentListState> = (nextProps, lastState) => {
    //     return {
    //         ...lastState,
    //         // orderBy: nextProps.currentODataOptions.orderby[0][0],
    //         // order: nextProps.currentODataOptions.orderby[0][1],
    //         // ids: nextProps.ids,
    //         // selected: (lastState && lastState.selected) || [],
    //         // active: (lastState && lastState.active) || null,
    //         // copy: (lastState && lastState.copy) || false,
    //     }
    // }

    private isSelected(content: GenericContent) {
        return this.state.selected.findIndex((c) => c.Id === content.Id) !== -1
    }

    private select(content: GenericContent) {
        if (!this.isSelected(content)) {
            this.setState({
                ...this.state,
                selected: [
                    ...this.state.selected,
                    content,
                ],
            })
        }
    }

    private deselect(content: GenericContent) {
        if (this.isSelected(content)) {
            this.setState({
                ...this.state,
                selected: this.state.selected.filter((c) => c.Id !== content.Id),
            })
        }
    }

    private invertSelect(content: GenericContent) {
        this.isSelected(content) ? this.deselect(content) : this.select(content)
    }

    private clearSelect() {
        this.setState({
            ...this.state,
            selected: [],
        })
    }

    private selectAll() {
        this.setState({
            ...this.state,
            selected: [...this.props.items.d.results],
        })
    }

    constructor(props) {
        super(props)
        this.handleRowSingleClick = this.handleRowSingleClick.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleTap = this.handleTap.bind(this)
    }

    public handleRowSingleClick(e, content, m) {
        // const { selected } = this.state
        // if (e.shiftKey) {
        //     e.preventDefault()
        //     const from = ids.indexOf(selected[selected.length - 1])
        //     const till = ids.indexOf(Number(e.target.closest('tr').id))
        //     if (from < till) {
        //         this.props.items.d.results.map((elId, i) => {
        //             if (i > from && i < till + 1) {
        //                 this.handleSimpleSelection(this.props.items.d.results.find((c) => c.Id === elId))
        //             }
        //         })
        //     } else {
        //         for (let i = ids.length - 1; i > -1; i--) {
        //             if (i < from && i > till - 1) {
        //                 this.handleSimpleSelection(this.props.items.d.results.find((c) => c.Id === ids[i]))
        //             }
        //         }
        //     }
        // } else if (e.ctrlKey) {
        //     this.handleSimpleSelection(content)
        // } else {
        //     e.target.getAttribute('type') !== 'checkbox' && window.innerWidth >= 700 ?
        //         this.handleSingleSelection(content) :
        //         this.handleSimpleSelection(content)
        // }
    }
    public handleRowDoubleClick(e: React.MouseEvent, content: GenericContent) {
        this.props.onDoubleClick(e, content)
    }
    public handleKeyDown(e) {
        const ctrl = e.ctrlKey ? true : false
        // const shift = e.shiftKey ? true : false
        const { items } = this.props

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
                const content = items.d.results.find((c) => c.Id === id)
                this.setState({
                    active: this.props.items.d.results.find((d) => d.Id === id),
                })
                switch (e.which) {
                    case Key.Space:
                        e.preventDefault()
                        this.invertSelect(content)
                        break
                    case Key.Enter:
                        e.preventDefault()
                        this.handleRowDoubleClick(e, content)
                        break
                    // case Key.UpArrow:
                    //     if (shift) {
                    //         const upperItemIndex = items.d.results.findIndex((c) => c.Id === this.state.active.Id) - 1
                    //         upperItemIndex > -1 ?
                    //             this.handleSimpleSelection(items.d.results.find((c) => c.Id === ids[upperItemIndex])) :
                    //             // tslint:disable-next-line:no-unused-expression
                    //             null
                    //     }
                    //     break
                    // case Key.DownArrow:
                    // ToDo
                    //     if (shift) {
                    //         const upperItemIndex = ids.indexOf(Number(this.state.active)) + 1
                    //         upperItemIndex < ids.length ?
                    //             this.handleSimpleSelection(items.d.results.find((c) => c.Id === ids[upperItemIndex])) :
                    //             // tslint:disable-next-line:no-unused-expression
                    //             null
                    //     }
                    //     break
                    case Key.Delete:
                        // ToDo:
                        // const permanent = shift ? true : false
                        // if (this.state.selected.length > 0) {
                        //     this.props.openDialog(
                        //         <DeleteDialog selected={this.state.selected} permanent={permanent} />,
                        //         resources.DELETE, this.state.clearSelection)
                        // }
                        break
                    case Key.A:
                        if (ctrl) {
                            e.preventDefault()
                            this.selectAll()
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
        this.state.selected.indexOf(content) > -1 ?
            this.deselect(content) :
            this.select(content)

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
        this.setState({ selected: [content], active: content.Id })
    }
    public handleRequestSort = (event, property) => {
        // ToDo: callback on props
        // this.props.setDefaultOdataOptions({
        //     ...this.props.currentODataOptions,
        //     orderby: [[property, this.props.currentODataOptions.orderby[0][1] === 'asc' ? 'desc' : 'asc']],
        // })
    }
    public handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.selectAll()
            return
        }
        this.clearSelect()
    }
    public handleTap(e: React.MouseEvent, content: GenericContent) {
        this.props.onTap(e, content)
    }

    public render() {
        // const { connectDropTarget } = this.props
        return (<div>
            {this.props.isLoading || this.props.items.d.results === null ?
                <LinearProgress color="secondary" style={{ position: 'absolute', width: '100%' }} />
                : null}
            <Table
                onKeyDown={(event) => this.handleKeyDown(event)}
                onKeyUp={(event) => this.handleKeyUp(event)}>
                <MediaQuery minDeviceWidth={700}>
                    <ListHead
                        headerColumnData={this.props.headerColumnData}
                        numSelected={this.state.selected.length}
                        order={'DisplayName'}
                        orderBy={'asc'}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={(event, property) => this.handleRequestSort(event, property)}
                        count={this.props.items.d.__count}
                    />
                </MediaQuery>
                <TableBody style={styles.tableBody}>
                    {this.props.items.d.results.map((content) => {
                        return typeof content !== 'undefined' ? (
                            null
                            // <SimpleTableRow
                            //     content={content}
                            //     key={content.Id}
                            //     handleRowDoubleClick={(ev) => this.props.onDoubleClick(ev, content)}
                            //     handleRowSingleClick={this.handleRowSingleClick}
                            //     handleTap={(e) => this.handleTap(e, content)}
                            //     isCopy={this.state.copy} />
                        ) : null
                    })
                    }

                </TableBody>
            </Table>
        </div>)
    }
}

export default ContentList
