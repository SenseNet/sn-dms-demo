import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { rootStateType } from '../../..'
import { withStore } from '../../../__tests__/TestHelper'
import ActionMenu from '../ActionMenu'

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
  } as Partial<Store.CreateStoreOptions<rootStateType>>
  ReactDOM.render(
    withStore(<ActionMenu id={0} />, options), div)
})
