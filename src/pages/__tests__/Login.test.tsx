import { LoginState } from '@sensenet/client-core'
import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  MemoryRouter,
} from 'react-router-dom'
import { rootStateType } from '../..'
import { withStore } from '../../__tests__/TestHelper'
import Login from '../Login'

it('renders without crashing', () => {
  const div = document.createElement('div')

  const options = {
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
    },
  } as Store.CreateStoreOptions<rootStateType>

  ReactDOM.render(
    withStore(
      <MemoryRouter>
        <Login oauthProvider={{} as any} clear={() => {
          //
        }} />
      </MemoryRouter>, options), div)
})
