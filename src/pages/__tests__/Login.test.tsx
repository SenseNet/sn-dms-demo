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
        session: {
          repository: {
            RepositoryUrl
              :
              'https://dmsservice.demo.sensenet.com',
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
