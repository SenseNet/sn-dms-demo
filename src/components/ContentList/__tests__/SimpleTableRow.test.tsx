import { LoginState } from '@sensenet/client-core'
import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  MemoryRouter,
} from 'react-router-dom'
import { rootStateType } from '../../..'
import { withStore } from '../../../__tests__/TestHelper'
import SimpleTableRow from '../SimpleTableRow'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const options = {
    persistedState: {
      sensenet: {
        currentcontent: {
          contentState: {},
        },
        batchResponses: {
          response: null,
        },
        session: {
          country: '',
          language: '',
          loginState: LoginState.Pending,
          user: {
            userName: 'aaa',
          },
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
          entities: [{
            Id: 123,
          }],
        },
      },
    },
  } as Store.CreateStoreOptions<rootStateType>

  ReactDOM.render(
    withStore(
      <MemoryRouter>
        <SimpleTableRow content={{ Id: 123 }} />
      </MemoryRouter>, options), div)
})
