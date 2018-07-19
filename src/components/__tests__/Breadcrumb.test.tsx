import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  MemoryRouter,
} from 'react-router-dom'
import { rootStateType } from '../..'
import { withStore } from '../../__tests__/TestHelper'
import BreadCrumb from '../BreadCrumb'

it('renders without crashing', () => {
  const div = document.createElement('div')

  const options = {
    persistedState: {
      dms: {
        breadcrumb: [{
          id: 4465,
          name: 'Document library',
          path: '/Root/Profiles/Public/alba/Document_Library',
        }],
      },
    },
  } as Store.CreateStoreOptions<rootStateType>
  ReactDOM.render(
    withStore(
      <MemoryRouter>
        <BreadCrumb />
      </MemoryRouter>, options), div)
})
