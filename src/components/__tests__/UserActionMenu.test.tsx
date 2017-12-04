import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store, Actions, Reducers } from 'sn-redux'
import { Repository } from 'sn-client-js'
import { combineReducers } from 'redux'
import 'rxjs'
import UserActionMenu from '../UserActionMenu';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const sensenet = Reducers.sensenet;
    const myReducer = combineReducers({ sensenet })

    const repository = new Repository.SnRepository({
        RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
        RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
    });

    repository.Config
    const store = Store.configureStore(myReducer, null, undefined, {
        sensenet: {
            session: {
                repository: {
                    RepositoryUrl
                    :
                    'https://dmsservice.demo.sensenet.com'
                }
            }
        }
    }, repository)
    ReactDOM.render(
        <Provider store={store}>
            <UserActionMenu store={store} />
        </Provider>, div);
});