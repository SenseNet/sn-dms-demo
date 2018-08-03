import { Table, TableBody } from '@material-ui/core'
import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  MemoryRouter,
} from 'react-router-dom'
import { rootStateType } from '../../..'
import { withStore } from '../../../__tests__/TestHelper'
import ParentFolderTableRow from '../ParentFolderTableRow'

it('renders without crashing', () => {
  const div = document.createElement('div')

  const options = {
    persistedState: {
      sensenet: {
        currentcontent: {
          content: {
            Id: 123,
            ParentId: 1,
          },
        },
      },
    },
  } as Partial<Store.CreateStoreOptions<rootStateType>>
  ReactDOM.render(withStore(
    <MemoryRouter>
      <Table>
        <TableBody>
          <ParentFolderTableRow />
        </TableBody>
      </Table>
    </MemoryRouter>, options), div)
})
