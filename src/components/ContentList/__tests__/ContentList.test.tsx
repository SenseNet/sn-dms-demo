import { LoginState, Repository } from '@sensenet/client-core'
import { Task } from '@sensenet/default-content-types'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { Reducers, Store } from '@sensenet/redux'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
    MemoryRouter,
} from 'react-router-dom'
import { combineReducers } from 'redux'
import * as DMSReducers from '../../../Reducers'
import ContentList from '../ContentList'

import { mount } from 'enzyme'
import { spy } from 'sinon'

import { configure } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import { rootStateType } from '../../..'
import { dms } from '../../../Reducers'

configure({ adapter: new Adapter() })

const sensenet = Reducers.sensenet
const actionmenu = DMSReducers.actions
const myReducer = combineReducers({ sensenet, actionmenu, dms }) as any
const sensenetDocumentViewer = sensenetDocumentViewerReducer

const repository = new Repository({
    repositoryUrl: process.env.REACT_APP_SERVICE_URL || 'https://dmsservice.demo.sensenet.com',
    requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId'] as any,
})

const options = {
    repository,
    rootReducer: myReducer,
    persistedState: {
        sensenet: {
            currentcontent: null,
            selected: null,
            batchResponses: null,
            session: {
                country: '',
                language: '',
                loginState: LoginState.Pending,
                user: null,
                error: null,
                repository: null,
            },
            currentworkspace: null,
            currentitems: {
                isFetching: false,
                entities: {
                    4466: {
                        Id: 4466,
                        Type: 'Folder',
                    },
                    4467: {
                        Id: 4467,
                        Type: 'Folder',
                    },
                    123: {
                        Id: 123,
                        Type: 'File',
                    },
                },
                ids: [4466, 4467, 123],
                actions: null,
                fields: null,
                schema: null,
                error: null,
                isOpened: false,
                options: null,
            },
        },
        dms: {
            actionmenu: null,
            rootId: 123,
            messagebar: null,
            breadcrumb: null,
            editedItemId: 1,
            editedFirst: null,
            currentId: 1,
            register: null,
            dialog: null,
            isLoading: false,
            isSelectionModeOn: false,
            menu: null,
            toolbar: null,
            uploads: null,
            viewer: null,
            workspaces: null,
        },
        sensenetDocumentViewer: null,
    },
} as Store.CreateStoreOptions<rootStateType>
const store = Store.createSensenetStore(options)

const content = { DisplayName: 'My content', Id: 123, Path: '/workspaces' } as Task
store.dispatch({ type: 'REQUEST_CONTENT_SUCCESS', payload: [content] })

describe('<ContentList />', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')

        ReactDOM.render(
            <Provider store={store}>
                <MemoryRouter>
                    <ContentList children={{ 123: { Id: 123 } }} />
                </MemoryRouter>
            </Provider>, div)
    })
})

describe('<ContentList /> methods', () => {

    // it('It should simulate ctlr key is pressed event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { keyCode: 13, ctrlKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate shift key is pressed event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { keyCode: 13, shiftKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate alt key is pressed event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { keyCode: 13, altKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate space keydown event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 32 })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter keydown event', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 13 })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter arrowdown keypress event with shift', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 40, shiftKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter arrowdown keypress event without shift', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 40, shiftKey: false })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter arrowup keypress event with shift', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 38, shiftKey: true })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter arrowup keypress event without shift', () => {
    //     const onKeyDown = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('keyDown', { which: 38, shiftKey: false })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(onKeyDown.called).toBeTruthy
    // })

    // it('It should simulate enter delete keypress event with shift', () => {
    //     const onKeyDown = sinon.spy();
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
    //             </MemoryRouter>
    //         </Provider>);
    //     const element = wrapper.find('tr').last();
    //     element.simulate('keyDown', { which: 46, shiftKey: true });
    //     expect(onKeyDown.called).toBeTruthy;
    // });

    // it('It should simulate enter delete keypress event without shift', () => {
    //     const onKeyDown = sinon.spy();
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList store={store} children={{ 123: { Id: 123 } }} onKeyDown={onKeyDown} />
    //             </MemoryRouter>
    //         </Provider>);
    //     const element = wrapper.find('tr').last();
    //     element.simulate('keyDown', { which: 46, shiftKey: false });
    //     expect(onKeyDown.called).toBeTruthy;
    // });

    // it('It should simulate select all checkbox click event', () => {
    //     const handleSelectAllClick = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('input[type="checkbox"]').first()
    //     element.simulate('click')
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(handleSelectAllClick.called).toBeTruthy
    // })

    // it('It should simulate row click event', () => {
    //     const handleRowSingleClick = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('click')
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(handleRowSingleClick.called).toBeTruthy
    // })

    // it('It should simulate pressing enter on a row', () => {
    //     const handleRowDoubleClick = spy()
    //     const wrapper = mount(
    //         <Provider store={store}>
    //             <MemoryRouter>
    //                 <ContentList children={{ 123: { Id: 123 } }} />
    //             </MemoryRouter>
    //         </Provider>)
    //     const element = wrapper.find('tr').last()
    //     element.simulate('dblclick', { id: 1 })
    //     // tslint:disable-next-line:no-unused-expression
    //     expect(handleRowDoubleClick.called).toBeTruthy
    // })
})
