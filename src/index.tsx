import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  HashRouter as Router
} from 'react-router-dom'
import Sensenet from './Sensenet';
import { combineReducers } from 'redux'
import { Repository } from 'sn-client-js'
import { Store, Actions, Reducers } from 'sn-redux'
import { AddGoogleAuth } from 'sn-client-auth-google';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { DMSEpics } from './Epics'
import { DMSReducers } from './Reducers'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
import './index.css';
import 'rxjs'

const sensenet = Reducers.sensenet;
const dms = DMSReducers.dms;
const myReducer = combineReducers({
  sensenet,
  dms
});

const repository = new Repository.SnRepository({
  RepositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
  RequiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId']
});

AddGoogleAuth(repository, {
  ClientId: '590484552404-d6motta5d9qeh0ln81in80fn6mqf608e.apps.googleusercontent.com',
  RedirectUri: 'http://localhost:24969/',
  Scope: ['email', 'profile']
})

const store = Store.configureStore(myReducer, DMSEpics.rootEpic, undefined, {}, repository)
store.dispatch(Actions.InitSensenetStore('/Root/Sites/Default_Site', { select: 'all' }))


ReactDOM.render(
  <Provider store={store}>
    <Router basename='/'>
      <Sensenet store={store} repository={repository} history={history} />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
