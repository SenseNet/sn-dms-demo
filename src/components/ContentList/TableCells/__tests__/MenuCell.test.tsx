import { Table, TableBody } from '@material-ui/core'
import { Task } from '@sensenet/default-content-types'
import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { withStore } from '../../../../__tests__/TestHelper'
import MenuCell from '../MenuCell'

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
    } as Store.CreateStoreOptions<any>
    const content = { DisplayName: 'My content', Id: 123, Path: '/workspaces' } as Task
    ReactDOM.render(
        withStore(
            <Table>
                <TableBody>
                    <tr>
                        <MenuCell
                            content={content}
                            isHovered={false}
                            isSelected={true}
                            actionMenuIsOpen={false} />
                    </tr>
                </TableBody>
            </Table>, options), div)
})
