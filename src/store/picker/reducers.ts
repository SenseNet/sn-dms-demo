import { GenericContent } from '@sensenet/default-content-types'
import { AnyAction, combineReducers, Reducer } from 'redux'

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

export const pickerTitle: Reducer<string> = (state: string = '', action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_PICKER':
            return action.title
        case 'CLOSE_PICKER':
            return {}
        default:
            return state
    }
}

export const pickerParent: Reducer<GenericContent | null> = (state: GenericContent = null, action: AnyAction) => {
    switch (action.type) {
        case 'SET_PICKER_PARENT':
            return action.content
        default:
            return state
    }
}

export const pickerItems: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'LOAD_PICKER_ITEMS_SUCCESS':
            return action.results
        default:
            return state
    }
}

export const picker = combineReducers({
    isOpened: pickerIsOpened,
    onClose: pickerOnClose,
    content: pickerContent,
    title: pickerTitle,
    parent: pickerParent,
})
