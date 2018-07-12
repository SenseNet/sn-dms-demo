import { addGoogleAuth } from '@sensenet/authentication-google'
import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import createHistory from 'history/createBrowserHistory'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'
import * as DMSReducers from './Reducers'
import registerServiceWorker from './registerServiceWorker'
import Sensenet from './Sensenet'
const history = createHistory()
import { JwtService } from '@sensenet/authentication-jwt'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import './index.css'
import { MessageBoxHandler } from './utils/MessageBoxHandler'
import { getViewerSettings } from './ViewerSettings'

const repository = new Repository({
  repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'Actions', 'Avatar', 'Owner'] as any,
  defaultExpand: ['Actions', 'Owner'] as any,
})
const jwt = new JwtService(repository)
const googleOauthProvider = addGoogleAuth(jwt, { clientId: '188576321252-cad8ho16mf68imajdvai6e2cpl3iv8ss.apps.googleusercontent.com' })

const viewerSettings = getViewerSettings(repository)

const sensenet = Reducers.sensenet
const dms = DMSReducers.dms
const sensenetDocumentViewer = sensenetDocumentViewerReducer

const myReducer = combineReducers({
  sensenet,
  dms,
  sensenetDocumentViewer,
})

const options = {
  repository,
  rootReducer: myReducer,
  middlewares: [thunk.withExtraArgument(Object.assign(repository, viewerSettings))],
  logger: false,
} as Store.CreateStoreOptions<any>
const store = Store.createSensenetStore(options)

export type rootStateType = ReturnType<typeof myReducer>

const handler = new MessageBoxHandler(repository, store)

ReactDOM.render(
  <Provider store={store}>
      <Sensenet repository={repository} history={history} oAuthProvider={googleOauthProvider} />
  </Provider>,
  document.getElementById('root') as HTMLElement,
)
registerServiceWorker()
