import { createMuiTheme, MuiThemeProvider, TableCell } from '@material-ui/core'
import { ConstantContent } from '@sensenet/client-core'
import { GenericContent, User } from '@sensenet/default-content-types'
import { pollDocumentData } from '@sensenet/document-viewer-react'
import { ContentList } from '@sensenet/list-controls-react'
import { uploadRequest } from '@sensenet/redux/dist/Actions'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { customSchema } from '../assets/schema'
import { loadParent, select } from '../store/documentlibrary/actions'
import { DateCell } from './ContentList/TableCells/DateCell'
import DisplayNameCell from './ContentList/TableCells/DisplayNameCell'
import { FetchError } from './FetchError'

const uploadContentAction = uploadRequest

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        items: state.dms.documentLibrary.items,
        errorMessage: state.dms.documentLibrary.error,
        parent: state.dms.documentLibrary.parent,
        isLoading: state.dms.documentLibrary.isLoading,
        currentUser: state.sensenet.session.user,
        hostname: state.sensenet.session.repository.repositoryUrl,
        selected: state.dms.documentLibrary.selected,
        active: state.dms.documentLibrary.active,
    }
}

const mapDispatchToProps = {
    loadParent,
    setCurrentId: DMSActions.setCurrentId,
    uploadContent: uploadContentAction,
    uploadDataTransfer: DMSActions.uploadDataTransfer,
    openViewer: DMSActions.openViewer,
    pollDocumentData,
    select,
}

interface DocumentLibraryProps extends RouteComponentProps<any> {
    /** */
}

interface DocumentLibraryState {
    droppedFiles,
}

// @DragDropContext(HTML5Backend, {

// })
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

    public handleFileDrop(item, monitor) {
        const { uploadDataTransfer, parent } = this.props
        if (monitor) {
            const dataTransfer = monitor.getItem().dataTransfer
            uploadDataTransfer({
                binaryPropertyName: 'Binary',
                contentTypeName: 'File',
                createFolders: true,
                event: new DragEvent('drop', { dataTransfer }),
                overwrite: false,
                parentPath: parent.Path,
            })
        }
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

        const theme = createMuiTheme({
            overrides: {
                MuiTableRow: {
                    hover: {
                        '&:hover': { color: '#016D9E', fontWeight: 'bold' },
                        'color': '#666',
                        'fontSize': 16,
                        'fontFamily': 'Raleway Light',
                        'cursor': 'pointer',
                    },
                },
                MuiCheckbox: {
                    checked: {
                        color: '#016D9E !important',
                    },
                },
            },
        })

        return this.props.currentUser.content.Id !== ConstantContent.VISITOR_USER.Id ?
            <MuiThemeProvider theme={theme}>
                <ContentList
                    schema={customSchema.find((s) => s.ContentTypeName === 'GenericContent')}
                    selected={this.props.selected}
                    active={this.props.active}
                    items={this.props.items.d.results}
                    fieldsToDisplay={['DisplayName', 'ModificationDate', 'Owner', 'Actions']}
                    orderBy={'DisplayName'}
                    orderDirection={'asc'}
                    onRequestSelectionChange={(newSelection) => this.props.select(newSelection)}
                    fieldComponent={(field, content) => (props) => {
                        const isSelected = props.selected.find((s) => s.Id === content.Id) ? true : false
                        switch (field) {
                            case 'DisplayName':
                                return (<DisplayNameCell content={content} isSelected={isSelected} updateContent={() => { /** */ }}></DisplayNameCell>)
                            case 'ModificationDate':
                                return (<DateCell date={content[field]} />)
                            case 'Owner':
                                return (<TableCell><span>{content.Owner && (content.Owner as User).DisplayName}</span></TableCell>)
                            case 'Actions':
                                return (<TableCell><span>ToDo</span></TableCell>)
                            default:
                                return (<TableCell><span>{content[field] && content[field].toString()}</span></TableCell>)
                        }
                    }}
                />
            </MuiThemeProvider>
            : null

    }
}

export default withRouter(connect<ReturnType<typeof mapStateToProps>, typeof mapDispatchToProps, DocumentLibraryProps>(mapStateToProps, mapDispatchToProps)(DocumentLibrary))
