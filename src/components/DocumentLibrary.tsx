import { IODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions, Reducers } from '@sensenet/redux'
import { loadContent } from '@sensenet/redux/dist/Actions'
import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend-filedrop'
import { connect } from 'react-redux'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import * as DMSReducers from '../Reducers'
import ContentList from './ContentList/ContentList'
import { FetchError } from './FetchError'

const fetchContentAction = Actions.requestContent
const uploadContentAction = Actions.uploadRequest

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        children: DMSReducers.getChildrenItems(state.sensenet),
        ids: Reducers.getIds(state.sensenet.children),
        errorMessage: Reducers.getError(state.sensenet.children),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
    }
}

const mapDispatchToProps = {
    fetchContent: fetchContentAction,
    setCurrentId: DMSActions.setCurrentId,
    loadContent,
    uploadContent: uploadContentAction,
    uploadDataTransfer: DMSActions.uploadDataTransfer,
}

interface DocumentLibraryProps {
    currentFolderId?: number
}

interface DocumentLibraryState {
    odataOptions: IODataParams<GenericContent> & { scenario: string }
    id, droppedFiles, children
    lastFolderId: number
}

@DragDropContext(HTML5Backend, {

})
class DocumentLibrary extends React.Component<DocumentLibraryProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DocumentLibraryState> {
    constructor(props) {
        super(props)
        this.state = {
            odataOptions: {
                select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner'],
                expand: ['Actions', 'Owner'],
                orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
                filter: 'ContentType ne \'SystemFolder\'',
                scenario: 'DMSListItem',
            },
            id: 0,
            droppedFiles: [],
            children: this.props.children,
            lastFolderId: this.props.currentFolderId,
        }
        this.handleFileDrop = this.handleFileDrop.bind(this)
    }

    public static getDerivedStateFromProps(newProps: DocumentLibrary['props'], lastState: DocumentLibrary['state']) {
        const lastLoadedContentId = lastState.id
        if (newProps.loggedinUser.userName !== 'Visitor') {
            if (!newProps.currentFolderId && newProps.currentContent.Path !== `/Root/Profiles/Public/${newProps.loggedinUser.userName}/Document_Library`) {
                newProps.loadContent(`/Root/Profiles/Public/${newProps.loggedinUser.userName}/Document_Library`, lastState.odataOptions)
            } else if (newProps.currentFolderId && newProps.currentFolderId !== newProps.currentContent.Id) {
                newProps.loadContent(newProps.currentFolderId, lastState.odataOptions)
            }

            // if (newProps.currentContent && newProps.currentContent.Id && newProps.currentContent.Path) {
            //     if (newProps.currentContent.Id !== lastState.id) {
            //         newProps.fetchContent(newProps.currentContent.Path, lastState.odataOptions)
            //         lastLoadedContentId = newProps.currentContent.Id
            //     }
            // }
        }
        return {
            ...lastState,
            id: lastLoadedContentId,
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
        return <div>
            <ContentList
                children={this.props.children}
                currentId={this.props.currentContent.Id}
                parentId={this.props.currentContent.ParentId}
                accepts={[FILE]}
                onDrop={this.handleFileDrop}
            />
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentLibrary)
