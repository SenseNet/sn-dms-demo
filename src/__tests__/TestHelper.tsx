import { Repository } from '@sensenet/client-core'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { Store } from '@sensenet/redux'
import { sensenet } from '@sensenet/redux/dist/Reducers'
import { CreateStoreOptions } from '@sensenet/redux/dist/Store'
import * as React from 'react'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { rootStateType } from '..'
import { dms } from '../Reducers'

it('Should help tests', () => {
    /** */
})

export const withStore = (component: JSX.Element, options?: CreateStoreOptions<rootStateType>) => {
    const myReducer = combineReducers({ sensenet, dms, sensenetDocumentViewer: sensenetDocumentViewerReducer })
    const repository = new Repository({
        repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
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
    } as Store.CreateStoreOptions<any>
    const store = Store.createSensenetStore({ ...defaultOptions, ...options })

    return (<Provider store={store} >
        {component}
    </Provider>)
}
