import { MuiThemeProvider } from '@material-ui/core'
import { ConstantContent } from '@sensenet/client-core'
import { GenericContent, IActionModel } from '@sensenet/default-content-types'
import { pollDocumentData } from '@sensenet/document-viewer-react'
import { ContentList } from '@sensenet/list-controls-react'
import { uploadRequest } from '@sensenet/redux/dist/Actions'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { contentListTheme } from '../assets/contentlist'
import { icons } from '../assets/icons'
import { customSchema } from '../assets/schema'
import { loadParent, select, setActive, updateChildrenOptions } from '../store/documentlibrary/actions'
import ActionMenu from './ActionMenu/ActionMenu'
import LockedCell from './ContentList/CellTemplates/LockedCell'
import { FetchError } from './FetchError'

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        items: state.dms.documentLibrary.items,
        errorMessage: state.dms.documentLibrary.error,
        parent: state.dms.documentLibrary.parent,
        parentIdOrPath: state.dms.documentLibrary.parentIdOrPath,
        isLoading: state.dms.documentLibrary.isLoading,
        currentUser: state.sensenet.session.user,
        hostname: state.sensenet.session.repository.repositoryUrl,
        selected: state.dms.documentLibrary.selected,
        active: state.dms.documentLibrary.active,
        childrenOptions: state.dms.documentLibrary.childrenOptions,
    }
}

const mapDispatchToProps = {
    loadParent,
    setCurrentId: DMSActions.setCurrentId,
    uploadContent: uploadRequest,
    uploadDataTransfer: DMSActions.uploadDataTransfer,
    openViewer: DMSActions.openViewer,
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
    pollDocumentData,
    select,
    setActive,
    updateChildrenOptions,
}

interface DocumentLibraryProps extends RouteComponentProps<any> {
    /** */
}

interface DocumentLibraryState {
    droppedFiles,
}

class DocumentLibrary extends React.Component<DocumentLibraryProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DocumentLibraryState> {
    constructor(props) {
        super(props)
        this.state = {
            droppedFiles: [],
        }

        this.handleFileDrop = this.handleFileDrop.bind(this)
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
    }
    public static getDerivedStateFromProps(newProps: DocumentLibrary['props'], lastState: DocumentLibrary['state']) {
        if (newProps.loggedinUser.userName !== 'Visitor') {
            const pathFromUrl = newProps.match.params.folderPath && atob(decodeURIComponent(newProps.match.params.folderPath))
            const userProfilePath = `/Root/Profiles/Public/${newProps.loggedinUser.content.Name}/Document_Library`
            newProps.loadParent(pathFromUrl || userProfilePath)
        }
        return {
            ...lastState,
        } as DocumentLibrary['state']
    }

    public handleFileDrop(ev: React.DragEvent) {
        const { uploadDataTransfer, parent } = this.props
        ev.preventDefault()
        uploadDataTransfer({
            binaryPropertyName: 'Binary',
            contentTypeName: 'File',
            createFolders: true,
            event: new DragEvent('drop', { dataTransfer: ev.dataTransfer }),
            overwrite: false,
            parentPath: parent.Path,
        })
    }

    public handleRowDoubleClick(e: React.MouseEvent, content: GenericContent) {
        if (content.IsFolder) {
            const newPath = compile(this.props.match.path)({ folderPath: btoa(content.Path) })
            this.props.history.push(newPath)
        } else {
            this.props.openViewer(content.Id)
            this.props.pollDocumentData(this.props.hostname, content.Id)
        }
    }

    public render() {
        if (this.props.errorMessage && this.props.errorMessage.length > 0) {
            return (
                <FetchError
                    message={this.props.errorMessage}
                    onRetry={() => {
                        // this.fetchData()
                    }}
                />
            )
        }

        return this.props.currentUser.content.Id !== ConstantContent.VISITOR_USER.Id ?
            <div onDragOver={(ev) => ev.preventDefault()} onDrop={this.handleFileDrop}>
                <MuiThemeProvider theme={contentListTheme}>
                    <ContentList
                        schema={customSchema.find((s) => s.ContentTypeName === 'GenericContent')}
                        selected={this.props.selected}
                        active={this.props.active}
                        items={this.props.items.d.results}
                        fieldsToDisplay={['DisplayName', 'Locked', 'ModificationDate', 'Owner', 'Actions']}
                        orderBy={this.props.childrenOptions.orderby[0][0] as any}
                        orderDirection={this.props.childrenOptions.orderby[0][1] as any}
                        onRequestSelectionChange={(newSelection) => this.props.select(newSelection)}
                        onRequestActiveItemChange={(active) => this.props.setActive(active)}
                        onRequestActionsMenu={(ev, content) => {
                            ev.preventDefault()
                            this.props.closeActionMenu()
                            this.props.openActionMenu(content.Actions as IActionModel[], content, '', ev.currentTarget.parentElement, { top: ev.clientY, left: ev.clientX })
                        }}
                        onItemContextMenu={(ev, content) => {
                            ev.preventDefault()
                            this.props.closeActionMenu()
                            this.props.openActionMenu(content.Actions as IActionModel[], content, '', ev.currentTarget.parentElement, { top: ev.clientY, left: ev.clientX })
                        }}
                        onRequestOrderChange={(field, direction) => {
                            this.props.updateChildrenOptions({
                                ...this.props.childrenOptions,
                                orderby: [[field, direction]],
                            })
                        }}
                        onItemClick={(ev, content) => {
                            if (ev.ctrlKey) {
                                if (this.props.selected.find((s) => s.Id === content.Id)) {
                                    this.props.select(this.props.selected.filter((s) => s.Id !== content.Id))
                                } else {
                                    this.props.select([...this.props.selected, content])
                                }
                            } else if (ev.shiftKey) {
                                const activeIndex = this.props.items.d.results.findIndex((s) => s.Id === this.props.active.Id)
                                const clickedIndex = this.props.items.d.results.findIndex((s) => s.Id === content.Id)
                                const newSelection = Array.from(new Set([...this.props.selected, ...[...this.props.items.d.results].slice(Math.min(activeIndex, clickedIndex), Math.max(activeIndex, clickedIndex) + 1)]))
                                this.props.select(newSelection)
                            } else if (!this.props.selected.length || this.props.selected.length === 1 && this.props.selected[0].Id !== content.Id) {
                                this.props.select([content])
                            }
                        }}
                        onItemDoubleClick={this.handleRowDoubleClick}
                        fieldComponent={(props) => {
                            switch (props.field) {
                                case 'Locked':
                                    return (<LockedCell content={props.content} fieldName={props.field} />)
                                default:
                                    return null
                            }
                        }}
                        icons={icons}
                    />
                    < ActionMenu id={0} />
                </MuiThemeProvider>
            </div>
            : null

    }
}

export default withRouter(connect<ReturnType<typeof mapStateToProps>, typeof mapDispatchToProps, DocumentLibraryProps>(mapStateToProps, mapDispatchToProps)(DocumentLibrary))
