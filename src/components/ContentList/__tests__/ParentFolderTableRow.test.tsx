import { Table, TableBody } from '@material-ui/core'
import { Repository } from '@sensenet/client-core'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  MemoryRouter,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import ParentFolderTableRow from '../ParentFolderTableRow'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const sensenet = Reducers.sensenet
  const myReducer = combineReducers({ sensenet })

  const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
  })

  const options = {
    repository,
    rootReducer: myReducer,
    persistedState: {
      sensenet: {
        session: {
          repository: {
            RepositoryUrl
              :
              'https://dmsservice.demo.sensenet.com',
          },
        },
        currentcontent: {
          content: {
            ParentId: 1,
          },
        },
      },
    },
  } as Store.CreateStoreOptions<any>
  const store = Store.createSensenetStore(options)
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={store}>
        <Table>
          <TableBody>
            <ParentFolderTableRow />
          </TableBody>
        </Table>
      </Provider>
    </MemoryRouter>, div)
})
