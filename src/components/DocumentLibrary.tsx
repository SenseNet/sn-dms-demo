import { ConstantContent, IODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { pollDocumentData } from '@sensenet/document-viewer-react'
import { Actions, Reducers } from '@sensenet/redux'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend-filedrop'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import ContentList from './ContentList/ContentList'
import { defaultHeaderColumnData } from './ContentList/ListHead'
import { FetchError } from './FetchError'

const fetchContentAction = Actions.requestContent
const uploadContentAction = Actions.uploadRequest
const setOdataOptionsAction = Actions.setDefaultOdataOptions

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        children: state.sensenet.currentitems.entities,
        errorMessage: Reducers.getError(state.sensenet.currentitems),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: state.dms.currentId,
        currentUser: state.sensenet.session.user,
        options: state.sensenet.currentitems.options,
        hostname: state.sensenet.session.repository.repositoryUrl,
    }
}

const mapDispatchToProps = {
    fetchContent: fetchContentAction,
    setOdataOptions: setOdataOptionsAction,
    setCurrentId: DMSActions.setCurrentId,
    uploadContent: uploadContentAction,
    uploadDataTransfer: DMSActions.uploadDataTransfer,
    loadContent: Actions.loadContent,
    openViewer: DMSActions.openViewer,
    pollDocumentData,
}

interface DocumentLibraryProps extends RouteComponentProps<any> {
    /** */
}

interface DocumentLibraryState {
    droppedFiles,
    odataOptions: IODataParams<GenericContent>
}

@DragDropContext(HTML5Backend, {

})
class DocumentLibrary extends React.Component<DocumentLibraryProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DocumentLibraryState> {
    constructor(props) {
        super(props)
        const defaultOptions = {
            select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner', 'VersioningMode'],
            expand: ['Actions', 'Owner'],
            orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
            filter: 'ContentType ne \'SystemFolder\'',
            scenario: 'DMSListItem',
        } as IODataParams<GenericContent>
        this.state = {
            odataOptions: defaultOptions,
            droppedFiles: [],
        }

        this.props.setOdataOptions(defaultOptions)
        this.handleFileDrop = this.handleFileDrop.bind(this)
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
    }
    public static getDerivedStateFromProps(newProps: DocumentLibrary['props'], lastState: DocumentLibrary['state']) {
        if (newProps.loggedinUser.userName !== 'Visitor') {

            const pathFromUrl = newProps.match.params.folderPath && atob(decodeURIComponent(newProps.match.params.folderPath))
            const odataOptions = newProps.options ? newProps.options : lastState.odataOptions
            const userProfilePath = `/Root/Profiles/Public/${newProps.loggedinUser.content.Name}/Document_Library`

            if (!newProps.currentContent || (pathFromUrl && pathFromUrl !== newProps.currentContent.Path)) {
                newProps.loadContent(pathFromUrl)
                newProps.fetchContent(pathFromUrl, odataOptions)
            }

            if (!pathFromUrl &&
                (!newProps.currentContent || newProps.currentContent.Path !== userProfilePath)
            ) {
                newProps.loadContent(userProfilePath)
                newProps.fetchContent(userProfilePath, odataOptions)
            }
        }
        return {
            ...lastState,
            odataOptions: newProps.options,
        } as DocumentLibrary['state']
    }

    public handleFileDrop(item, monitor) {
        const { uploadDataTransfer, currentContent } = this.props
        if (monitor) {
            const dataTransfer = monitor.getItem().dataTransfer
            uploadDataTransfer({
                binaryPropertyName: 'Binary',
                contentTypeName: 'File',
                createFolders: true,
                event: new DragEvent('drop', { dataTransfer }),
                overwrite: false,
                parentPath: currentContent.Path,
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
        const { FILE } = NativeTypes
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
        return this.props.currentContent && this.props.currentUser.content.Id !== ConstantContent.VISITOR_USER.Id ?
            <ContentList
                children={this.props.children}
                currentId={this.props.currentContent ? this.props.currentContent.Id : null}
                parentId={this.props.currentContent ? this.props.currentContent.ParentId : null}
                accepts={[FILE]}
                onDrop={this.handleFileDrop}
                headerColumnData={defaultHeaderColumnData}
                onDoubleClick={this.handleRowDoubleClick}
            />
            : null

    }
}

export default withRouter(connect<ReturnType<typeof mapStateToProps>, typeof mapDispatchToProps, DocumentLibraryProps>(mapStateToProps, mapDispatchToProps)(DocumentLibrary))
