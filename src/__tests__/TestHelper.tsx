import { Repository } from '@sensenet/client-core'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react/dist/store'
import { Store } from '@sensenet/redux'
import { Reducers } from '@sensenet/redux'
import { CreateStoreOptions } from '@sensenet/redux/dist/Store'
import * as React from 'react'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { rootStateType } from '..'
import { dms } from '../Reducers'

it('Should help tests', () => {
    /** */
})

export const withStore = (component: JSX.Element, options?: Partial<CreateStoreOptions<rootStateType>>) => {
    const myReducer = combineReducers({ sensenet: Reducers.sensenet, dms, sensenetDocumentViewer: sensenetDocumentViewerReducer })
    const repository = new Repository({
        repositoryUrl: process.env.REACT_APP_SERVICE_URL,
        requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
    })
    const defaultOptions = {
        repository,
        rootReducer: myReducer,
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
    const store = Store.createSensenetStore({ ...defaultOptions, ...options } as CreateStoreOptions<rootStateType>)

    return (<Provider store={store} >
        {component}
    </Provider>)
}
