import { Table, TableBody } from '@material-ui/core'
import { Task } from '@sensenet/default-content-types'
import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { rootStateType } from '../../../..'
import { withStore } from '../../../../__tests__/TestHelper'
import { IconCell } from '../IconCell'

it('renders without crashing', () => {
    const div = document.createElement('div')

    const options = {
        persistedState: {
            sensenet: {
                currentitems: {
                    entities: [{
                        Id: 123,
                        Actions: [],
                    }],
                },
            },
        },
    } as Partial<Store.CreateStoreOptions<rootStateType>>
    const content = { DisplayName: 'My content', Id: 123, Path: '/workspaces' } as Task
    ReactDOM.render(
        withStore(
            <Table>
                <TableBody>
                    <tr>
                        < IconCell
                            id={1}
                            icon="edit"
                            selected={false}
                            handleRowDoubleClick={() => {
                                //
                            }}
                            handleRowSingleClick={() => {
                                //
                            }} />
                    </tr>
                </TableBody>
            </Table>, options), div)
})
