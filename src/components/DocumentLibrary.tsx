import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend-filedrop'
import { connect } from 'react-redux'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { DocumentLibraryActions } from '../store/DocumentLibrary'
import ContentList from './ContentList/ContentList'
import { FetchError } from './FetchError'
import { FullScreenLoader } from './FullScreenLoader'

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        contentList: state.dms.pages.documentLibrary.children,
        currentDocumentLibaray: state.dms.pages.documentLibrary.currentDocumentLibrary,
        currentFolder: state.dms.pages.documentLibrary.currentFolder,
        error: state.dms.pages.documentLibrary.error,
        currentUser: state.sensenet.session.user,
    }
}

const mapDispatchToProps = {
    uploadDataTransfer: DMSActions.uploadDataTransfer,
    setDefaultDocumentLibraryForUser: DocumentLibraryActions.setDefaultDocumentLibraryForUser,
}

interface DocumentLibraryProps {
    currentFolderId?: number
}

@DragDropContext(HTML5Backend, {

})
class DocumentLibrary extends React.Component<DocumentLibraryProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {
    constructor(props) {
        super(props)
        this.handleFileDrop = this.handleFileDrop.bind(this)
    }
    public handleFileDrop(item, monitor) {
        const { uploadDataTransfer, currentFolder } = this.props
        if (monitor) {
            const dataTransfer = monitor.getItem().dataTransfer
            uploadDataTransfer({
                binaryPropertyName: 'Binary',
                contentTypeName: 'File',
                createFolders: true,
                event: new DragEvent('drop', { dataTransfer }),
                overwrite: false,
                parentPath: currentFolder.Path,
            })

        }
    }
    public render() {
        const { FILE } = NativeTypes
        if (this.props.error) {
            return (
                <FetchError
                    message={this.props.error}
                    onRetry={() => {
                        // this.fetchData()
                    }}
                />
            )
        }

        if (!this.props.currentDocumentLibaray || !this.props.currentFolder) {
            if (this.props.currentUser.userName !== 'Visitor') {
                this.props.setDefaultDocumentLibraryForUser(this.props.currentUser.userName)
            }
            return null
        }

        return <div>
            <ContentList
                contentList={this.props.contentList}
                parentId={this.props.currentFolder.Id}
                accepts={[FILE]}
                onDrop={this.handleFileDrop}
            />
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentLibrary)
