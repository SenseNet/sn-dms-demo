import { combineReducers } from 'redux'
import { documentLibraryReducer } from './DocumentLibrary'

export const pagesReducer = combineReducers({
    documentLibrary: documentLibraryReducer,
})
