import { IODataCollectionResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Reducer } from 'redux'
import { setError, setItems, setParent, startLoading } from './actions'

export interface DocumentLibraryState {
    parent?: GenericContent
    parentIdOrPath?: string | number,
    items: IODataCollectionResponse<GenericContent>
    isLoading: boolean
    error?: any
}

export const defaultState: DocumentLibraryState = {
    isLoading: true,
    items: { d: { __count: 0, results: [] } },
}

export const documentLibrary: Reducer<DocumentLibraryState> = (state = defaultState, action) => {
    switch (action.type) {
        case 'DMS_DOCLIB_LOADING':
            return {
                isLoading: true,
                parentIdOrPath: (action as ReturnType<typeof startLoading>).idOrPath,
                parent: undefined,
                items: defaultState.items,
            }
        case 'DMS_DOCLIB_FINISH_LOADING':
            return {
                ...state,
                isLoading: false,
            }
        case 'DMS_DOCLIB_SET_PARENT':
            return {
                ...state,
                parent: (action as ReturnType<typeof setParent>).content,
            }
        case 'DMS_DOCLIB_SET_ITEMS':
            return {
                ...state,
                items: (action as ReturnType<typeof setItems>).items,
            }
        case 'DMS_DOCLIB_SET_ERROR':
            return {
                ...state,
                error: (action as ReturnType<typeof setError>).error,
            }

    }
    return state
}
