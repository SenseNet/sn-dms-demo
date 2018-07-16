import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  MemoryRouter,
} from 'react-router-dom'
import { rootStateType } from '../..'
import { withStore } from '../../__tests__/TestHelper'
import DocumentLibrary from '../DocumentLibrary'

it('renders without crashing', () => {
  const div = document.createElement('div')

  const options = {
    persistedState: {
      dms: {
        actionmenu: {
          actions: [],
        },
      },
    },
  } as Store.CreateStoreOptions<rootStateType>
  ReactDOM.render(
    withStore(
      <MemoryRouter>
        <DocumentLibrary />
      </MemoryRouter>, options), div)
})
