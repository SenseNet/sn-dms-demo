import * as React from 'react'
import { connect } from 'react-redux';
import { Content } from 'sn-client-js'
import { DMSReducers } from '../Reducers'
import { DMSActions } from '../Actions'
import { Actions, Reducers } from 'sn-redux'
import { FetchError } from './FetchError'
import ContentList from './ContentList'
import { CircularProgress } from 'material-ui/Progress';

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'
    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'
    },
    loader: {
        margin: '0 auto'
    }
}

interface IDocumentLibraryProps {
    currentId,
    path,
    children,
    ids,
    loggedinUser,
    fetchContent: Function,
    errorMessage: string,
    isFetching: boolean
}

class DocumentLibrary extends React.Component<IDocumentLibraryProps, { select, id, orderby }>{
    constructor(props) {
        super(props)
        this.state = {
            select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder'],
            orderby: ['IsFolder desc', 'DisplayName asc'] as any,
            id: this.props.currentId
        }
    }
    componentDidMount() {
        if (this.props.loggedinUser.userName !== 'Visitor') {
            this.fetchData();
        }
    }
    componentDidUpdate(prevOps) {
        if (this.props.loggedinUser.userName !== prevOps.loggedinUser.userName) {
          this.fetchData();
        }
      }
    fetchData() {
        let optionObj = {
            select: this.state.select,
            orderby: this.state.orderby
        }
        const path = `/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library${this.props.currentId ? `/${this.props.currentId}` : ''}`;
        this.props.fetchContent(path, optionObj);
    }

    render() {
        if (this.props.isFetching && this.props.children.length > 0) {
            return (
                <div style={styles.loader}>
                    <CircularProgress color='accent' size={50} />
                </div>
            )
        }
        if (this.props.errorMessage && this.props.errorMessage.length > 0) {
            return (
                <FetchError
                    message={this.props.errorMessage}
                    onRetry={() => this.fetchData()}
                />
            )
        }
        if (this.props.loggedinUser.userName !== 'Visitor') {
            return <ContentList
                children={this.props.children}
                ids={this.props.ids}
                currentId={this.props.currentId}
            //onTodoClick={this.props.onTodoClick} 
            //onDeleteClick={this.props.onDeleteClick} 
            />
        }
        return <div></div>
    }
}

const fetchContentAction = Actions.RequestContent;

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
        path: DMSReducers.getCurrentContentPath(state.sensenet.currentcontent),
        children: DMSReducers.getChildrenItems(state.sensenet),
        ids: Reducers.getIds(state.sensenet.children),
        errorMessage: Reducers.getError(state.sensenet.children),
        isFetching: Reducers.getFetching(state.sensenet.children)
    }
}

export default connect(mapStateToProps, {
    fetchContent: fetchContentAction
})(DocumentLibrary)