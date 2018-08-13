import { Task } from '@sensenet/default-content-types'
import { Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { rootStateType } from '../../../..'
import { withStore } from '../../../../__tests__/TestHelper'
import DisplayNameCell from '../DisplayNameCell'

it('renders without crashing', () => {
    const div = document.createElement('div')

    const options = {
        persistedState: {
            sensenet: {
                currentcontent: {
                    content: { Id: 1 },
                },
            },
        },
    } as any as Store.CreateStoreOptions<rootStateType>
    const content = { DisplayName: 'My content', Id: 123, Path: '/workspaces' } as Task
    ReactDOM.render(
        withStore(<DisplayNameCell
            content={content}
            isSelected={false}
            updateContent={() => {/** */ }}
        />, options), div)
})
