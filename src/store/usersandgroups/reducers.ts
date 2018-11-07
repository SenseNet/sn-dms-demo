import { IODataCollectionResponse } from '@sensenet/client-core'
import { Group, User } from '@sensenet/default-content-types'
import { AnyAction, combineReducers, Reducer } from 'redux'

export const currentUser: Reducer<User | null> = (state: User = null, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_USER':
            return action.content
        default:
            return state
    }
}

export const memberships: Reducer<IODataCollectionResponse<Group>> = (state: IODataCollectionResponse<Group> = { d: { __count: 0, results: [] } }, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_MEMBERSHIPS_SUCCESS':
            return action.state
        default:
            return state
    }
}

export const error: Reducer<any> = (state: any = null, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_ERROR':
            return action.error
        default:
            return state
    }
}
export const isLoading: Reducer<boolean> = (state: boolean = false, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_LOADING':
            return true
        case 'DMS_USERSANDGROUPS_FINISH_LOADING':
            return false
        default:
            return state
    }
}

export const isAdmin: Reducer<boolean> = (state: boolean = false, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USER_ISADMIN':
            return action.admin
        default:
            return state
    }
}

export const user = combineReducers({
    currentUser,
    isAdmin,
    memberships,
    error,
    isLoading,
})

export const usersAndGroups = combineReducers({
    user,
})
