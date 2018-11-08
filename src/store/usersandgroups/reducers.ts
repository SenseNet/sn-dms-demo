import { IODataCollectionResponse, IODataParams } from '@sensenet/client-core'
import { GenericContent, User } from '@sensenet/default-content-types'
import { AnyAction, combineReducers, Reducer } from 'redux'

export const currentUser: Reducer<User | null> = (state: User = null, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_USER':
            return action.content
        default:
            return state
    }
}

export const memberships: Reducer<IODataCollectionResponse<GenericContent>> = (state: IODataCollectionResponse<GenericContent> = { d: { __count: 0, results: [] } }, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_MEMBERSHIPS':
            return action.items
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

export const ancestors: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_ANCESTORS':
            return action.ancestors
        default:
            return state
    }
}

export const selected: Reducer<GenericContent[]> = (state: GenericContent[] = [], action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_ANCESTORS':
            return action.ancestors
        default:
            return state
    }
}

export const loadChunkSize = 25

const defaultOptions = {
    select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner', 'VersioningMode', 'ParentId', 'CheckedOutTo', 'Approvable'],
    expand: ['Actions', 'Owner', 'CheckedOutTo'],
    orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
    filter: 'ContentType ne \'SystemFolder\'',
    scenario: 'DMSListItem',
    top: loadChunkSize,
} as IODataParams<GenericContent>

export const grouplistOptions: Reducer<IODataParams<GenericContent>> = (state: IODataParams<GenericContent> = defaultOptions, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_CHILDREN_OPTIONS':
            return action.odataOptions
        default:
            return state
    }
}

export const active: Reducer<GenericContent|null> = (state: GenericContent = null, action: AnyAction) => {
    switch (action.type) {
        case 'DMS_USERSANDGROUPS_SET_ACTIVE':
            return action.active
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
    ancestors,
    selected,
    grouplistOptions,
    active,
})

export const usersAndGroups = combineReducers({
    user,
})
