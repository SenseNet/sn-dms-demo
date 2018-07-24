import { LoginState, Repository } from '@sensenet/client-core'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  MemoryRouter,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import { rootStateType } from '../..'
import * as DMSReducers from '../../Reducers'
import Dashboard from '../Dashboard'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const sensenet = Reducers.sensenet
  const dms = DMSReducers.dms
  const sensenetDocumentViewer = sensenetDocumentViewerReducer
  const myReducer = combineReducers({ sensenet, dms, sensenetDocumentViewer })

  const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'Actions'] as any,
    defaultExpand: ['Actions'] as any,
  })

  const options = {
    repository,
    rootReducer: myReducer as any,
    persistedState: {
      sensenet: {
        currentcontent: null,
        batchResponses: null,
        session: {
          country: '',
          language: '',
          loginState: LoginState.Pending,
          user: null,
          error: null,
          repository: null,
        },
        selected: {
          ids: [123],
          entities: {
            123: { Id: 123 },
          },
        },
        currentitems: {
          ids: [123],
          entities: {
            123: {
              Id: 123,
            },
          },
        },
      },
      dms: {
        breadcrumb: [{
          id: 4465,
          name: 'Document library',
          path: '/Root/Profiles/Public/alba/Document_Library',
        }],
        actionmenu: {
          actions: [],
        },
      },
    },
  } as Store.CreateStoreOptions<rootStateType>

  const store = Store.createSensenetStore(options)
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={store}>
        <Dashboard match={{ params: { id: 111 } } as any} history={{} as any} location={{} as any} />
      </Provider>
    </MemoryRouter>, div)
})
