import { ConstantContent, IODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend-filedrop'
import { connect } from 'react-redux'
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
    }
}

const mapDispatchToProps = {
    fetchContent: fetchContentAction,
    setOdataOptions: setOdataOptionsAction,
    setCurrentId: DMSActions.setCurrentId,
    uploadContent: uploadContentAction,
    uploadDataTransfer: DMSActions.uploadDataTransfer,
    loadContent: Actions.loadContent,
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
            select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner', 'VersioningMode'],
            expand: ['Actions', 'Owner'],
            orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
            filter: 'ContentType ne \'SystemFolder\'',
            scenario: 'DMSListItem',
        } as IODataParams<GenericContent>
        this.state = {
            odataOptions: defaultOptions,
            id: this.props.currentContent ? this.props.currentContent.Id : null,
            droppedFiles: [],
            children: this.props.children,
        }

        this.props.setOdataOptions(defaultOptions)
        this.handleFileDrop = this.handleFileDrop.bind(this)
    }
    public static getDerivedStateFromProps(newProps: DocumentLibrary['props'], lastState: DocumentLibrary['state']) {
        if (newProps.loggedinUser.userName !== 'Visitor') {
            if (newProps.currentContent === null) {
                newProps.loadContent(newProps.currentContent && newProps.currentContent.Id || newProps.currentFolderId)
            }

            if (newProps.currentContent && newProps.currentContent.Id && newProps.currentContent.Path) {
                if (newProps.options !== lastState.odataOptions
                    || lastState.id !== newProps.currentContent.Id
                ) {
                    newProps.options ? newProps.fetchContent(newProps.currentContent.Path, newProps.options) :
                        newProps.fetchContent(newProps.currentContent.Path, lastState.odataOptions)
                }
            }
        }
        return {
            ...lastState,
            odataOptions: newProps.options,
            id: newProps.currentContent ? newProps.currentContent.Id : null,
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
        return this.props.currentContent && this.props.currentUser.content.Id !== ConstantContent.VISITOR_USER.Id ?
            <ContentList
                children={this.props.children}
                currentId={this.props.currentContent ? this.props.currentContent.Id : null}
                parentId={this.props.currentContent ? this.props.currentContent.ParentId : null}
                accepts={[FILE]}
                onDrop={this.handleFileDrop}
                headerColumnData={defaultHeaderColumnData}
            />
            : null

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentLibrary)
