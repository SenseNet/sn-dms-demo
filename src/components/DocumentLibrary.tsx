import { IODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions, Reducers } from '@sensenet/redux'
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
const setOdataOptionsAction = Actions.setDefaultOdataOptions

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
        children: DMSReducers.getChildrenItems(state.sensenet),
        ids: Reducers.getIds(state.sensenet.currentitems),
        errorMessage: Reducers.getError(state.sensenet.currentitems),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: DMSReducers.getCurrentId(state.dms),
        options: state.sensenet.currentitems.options,
    }
}

const mapDispatchToProps = {
    fetchContent: fetchContentAction,
    setOdataOptions: setOdataOptionsAction,
    setCurrentId: DMSActions.setCurrentId,
    uploadContent: uploadContentAction,
    uploadDataTransfer: DMSActions.uploadDataTransfer,
}

interface DocumentLibraryProps {
    currentFolderId?: number
}

interface DocumentLibraryState {
    id, droppedFiles, children,
    odataOptions: IODataParams<GenericContent>
}

@DragDropContext(HTML5Backend, {

})
class DocumentLibrary extends React.Component<DocumentLibraryProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DocumentLibraryState> {
    constructor(props) {
        super(props)
        const defaultOptions = {
            select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner'],
            expand: ['Actions', 'Owner'],
            orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
            filter: 'ContentType ne \'SystemFolder\'',
            scenario: 'DMSListItem',
        } as IODataParams<GenericContent>

        this.state = {
            odataOptions: defaultOptions,
            id: this.props.currentContent.Id,
            droppedFiles: [],
            children: this.props.children,
        }

        this.props.setOdataOptions(defaultOptions)
        this.handleFileDrop = this.handleFileDrop.bind(this)
    }

    public static getDerivedStateFromProps(newProps: DocumentLibrary['props'], lastState: DocumentLibrary['state']) {
        if (newProps.loggedinUser.userName !== 'Visitor') {
            if (newProps.currentContent && newProps.currentContent.Id && newProps.currentContent.Path) {
                if (newProps.options !== lastState.odataOptions) {
                    newProps.fetchContent(newProps.currentContent.Path, newProps.options)
                 }
            }
        }
        return {
            ...lastState,
            id: newProps.currentContent.Id,
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
