import { GenericContent } from '@sensenet/default-content-types'
import { createContent, PromiseReturns } from '@sensenet/redux/dist/Actions'
import { AnyAction, combineReducers, Reducer } from 'redux'
import { loadPickerItems, loadPickerParent } from './Actions'

export const pickerIsOpened: Reducer<boolean> = (state: false, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_PICKER':
            return true
        case 'CLOSE_PICKER':
            return false
        default:
            return state || false
    }
}

export const pickerOnClose = (state: () => void = null, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_PICKER':
            return action.onClose
        case 'CLOSE_PICKER':
            return null
        default:
            return state
    }
}

export const pickerContent = (state: any = '', action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_PICKER':
            return action.content
        case 'CLOSE_PICKER':
            return state
        default:
            return state
    }
}

export const pickerParent: Reducer<GenericContent | null> = (state: GenericContent = null, action: AnyAction) => {
    switch (action.type) {
        case 'SET_PICKER_PARENT':
            return action.content
        case 'LOAD_PICKER_PARENT_SUCCESS':
            // tslint:disable-next-line:no-string-literal
            return (action as ReturnType<typeof loadPickerParent>)['result'].d
        default:
            return state
    }
}

export const pickerItems: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'LOAD_PICKER_ITEMS_SUCCESS':
            return (action.result as PromiseReturns<typeof loadPickerItems>).d.results.filter((item) => item.Id !== action.current.Id)
        case 'CREATE_CONTENT_SUCCESS':
            const newContent = (action.result as PromiseReturns<typeof createContent>).d
            return [...state, newContent]
        default:
            return state
    }
}

export const pickerSelected: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'SELECT_PICKER_ITEM':
            return action.content ? [action.content] : []
        case 'DESELECT_PICKER_ITEM':
            return []
        default:
            return state
    }
}

export const closestWorkspace: Reducer<string | null> = (state: string = null, action: AnyAction) => {
    switch (action.type) {
        case 'SET_PICKER_PARENT':
            return action.content.Workspace.Path
        case 'LOAD_PICKER_PARENT_SUCCESS':
            // tslint:disable-next-line:no-string-literal
            return (action.result as PromiseReturns<typeof loadPickerParent>).d.Workspace['Path']
        default:
            return state || null
    }
}

export const backLink: Reducer<boolean> = (state: boolean = true, action: AnyAction) => {
    switch (action.type) {
        case 'SET_BACKLINK':
            return action.state
        default:
            return state
    }
}

export const picker = combineReducers({
    isOpened: pickerIsOpened,
    pickerOnClose,
    content: pickerContent,
    parent: pickerParent,
    items: pickerItems,
    selected: pickerSelected,
    closestWorkspace,
    backLink,
})
