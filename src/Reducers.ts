import { AnyAction, combineReducers } from 'redux'
import { ExtendedUploadProgressInfo } from './Actions'
import { resources } from './assets/resources'

enum MessageMode { error, warning, info }

export const email = (state = '', action) => {
    switch (action.type) {
        case 'USER_REGISTRATION_REQUEST':
            return action.email
        case 'USER_REGISTRATION_SUCCESS':
        case 'USER_REGISTRATION_FAILURE':
            return state
        default:
            return state
    }
}
export const registrationError = (state = null, action) => {
    switch (action.type) {
        case 'USER_REGISTRATION_FAILURE':
            return resources.USER_IS_ALREADY_REGISTERED
        default:
            return state
    }
}
export const isRegistering = (state = false, action) => {
    switch (action.type) {
        case 'USER_REGISTRATION_REQUEST':
            return true
        case 'USER_REGISTRATION_SUCCESS':
        case 'USER_REGISTRATION_FAILURE':
            return false
        default:
            return state
    }
}

export const registrationDone = (state = false, action) => {
    switch (action.type) {
        case 'USER_REGISTRATION_SUCCESS':
            return true
        case 'USER_REGISTRATION_REQUEST':
        case 'USER_REGISTRATION_FAILURE':
        case 'CLEAR_USER_REGISTRATION':
            return false
        default:
            return state
    }
}

export const captcha = (state = false, action) => {
    switch (action.type) {
        case 'VERIFY_CAPTCHA_SUCCESS':
            return true
        default:
            return state
    }
}

export const register = combineReducers({
    email,
    registrationError,
    isRegistering,
    registrationDone,
    captcha,
})

export const actions = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_ACTIONS_SUCCESS':
            return action.payload.d.Actions ? action.payload.d.Actions : []
        case 'OPEN_ACTIONMENU':
            return action.actions || []
        case 'CLOSE_ACTIONMENU':
            return []
        default:
            return state
    }
}

export const open = (state = false, action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return true
        case 'CLOSE_ACTIONMENU':
            return false
        default:
            return state
    }
}

export const id = (state = null, action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return action.id
        default:
            return state
    }
}

export const title = (state = '', action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return action.title
        default:
            return state
    }
}

export const anchorElement = (state = null, action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return action.element
        default:
            return state
    }
}

export const position = (state = null, action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return action.position || null
        default:
            return state
    }
}

export const rootId = (state = null, action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            if (!state && action.payload.d.Path.indexOf('Default_Site') === -1) {
                return action.payload.d.Id
            } else {
                return state
            }
        default:
            return state
    }
}

export const currentId = (state = null, action) => {
    switch (action.type) {
        case 'SET_CURRENT_ID':
            return action.id
        default:
            return state
    }
}

export const editedItemId = (state = null, action) => {
    switch (action.type) {
        case 'SET_EDITED_ID':
            return action.id
        case 'UPDATE_CONTENT_SUCCESS':
            return null
        default:
            return state
    }
}

export const editedFirst = (state = false, action) => {
    switch (action.type) {
        case 'SET_EDITED_ID':
            return action.id ? true : false
        case 'SET_EDITED_FIRST':
            return action.edited
        case 'UPDATE_CONTENT_SUCCESS':
            return false
        default:
            return state
    }
}

export const breadcrumb = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            if (action.payload.d.Path.indexOf('Default_Site') === -1 && state.filter((e) => e.id === action.payload.d.Id).length === 0) {
                const element = {
                    name: action.payload.d.DisplayName,
                    id: action.payload.d.Id,
                    path: action.payload.d.Path,
                }
                return [...state, element]
            } else if (state.filter((e) => e.id === action.payload.d.Id).length > 0) {
                const index = state.findIndex((e) => e.id === action.payload.d.Id) + 1
                return [...state.slice(0, index)]
            } else {
                return state
            }
        default:
            return state
    }
}

export const isLoading = (state = false, action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            return false
        case 'LOAD_CONTENT_REQUEST':
            return true
        default:
            return state
    }
}

export const isSelectionModeOn = (state = false, action) => {
    switch (action.type) {
        case 'SELECTION_MODE_ON':
            return true
        case 'SELECTION_MODE_OFF':
        case 'CLEAR_SELECTION':
            return false
        default:
            return state
    }
}

export const userActions = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_USER_ACTIONS_SUCCESS':
            return action.payload.d.Actions ? action.payload.d.Actions : []
        default:
            return state
    }
}

export const actionmenu = combineReducers({
    actions,
    open,
    anchorElement,
    position,
    id,
    title,
    userActions,
})

export const messagebarmode = (state = MessageMode.info, action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return action.mode
        case 'CLOSE_MESSAGE_BAR':
            return MessageMode.info
        default:
            return state
    }
}

export const messagebarcontent = (state = {}, action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return action.content
        case 'CLOSE_MESSAGE_BAR':
            return {}
        default:
            return state
    }
}

export const messagebaropen = (state = false, action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return true
        case 'CLOSE_MESSAGE_BAR':
            return false
        default:
            return state
    }
}

export const vertical = (state = 'bottom', action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return action.vertical
        default:
            return state
    }
}

export const horizontal = (state = 'left', action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return action.horizontal
        default:
            return state
    }
}

export const messagebar = combineReducers({
    open: messagebaropen,
    mode: messagebarmode,
    content: messagebarcontent,
    vertical,
    horizontal,
})

export const toolbarActions = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_LIST_ACTIONS_SUCCESS':
            return action.payload.d.Actions
        default:
            return state
    }
}

export const toolbar = combineReducers({
    actions: toolbarActions,
})

export const uploads = (state: { uploads: ExtendedUploadProgressInfo[], showProgress: boolean } = { uploads: [], showProgress: false }, action: AnyAction) => {
    switch (action.type) {
        case 'UPLOAD_ADD_ITEM':
            return {
                ...state,
                showProgress: true,
                uploads: [
                    ...state.uploads,
                    action.uploadItem,
                ],
            }
        case 'UPLOAD_UPDATE_ITEM':
            return {
                ...state,
                uploads: state.uploads.map((uploadItem) => {
                    if (uploadItem.guid === action.uploadItem.guid) {
                        return {
                            ...uploadItem,
                            ...action.uploadItem,
                        }
                    }
                    return uploadItem
                }),
            }
        case 'UPLOAD_HIDE_ITEM':
            return {
                ...state,
                uploads: state.uploads.map((uploadItem) => {
                    if (uploadItem.guid === action.uploadItem.guid) {
                        return {
                            ...uploadItem,
                            ...action.uploadItem,
                            visible: false,
                        }
                    }
                    return uploadItem
                }),
            }
        case 'UPLOAD_REMOVE_ITEM':
            return {
                ...state,
                uploads: state.uploads.filter((u) => u.guid !== action.uploadItem.guid),
            }
        case 'UPLOAD_HIDE_PROGRESS':
            return {
                ...state,
                showProgress: false,
            }
        case 'UPLOAD_SHOW_PROGRESS':
            return {
                ...state,
                showProgress: false,
            }
    }
    return state
}

export const dms = combineReducers({
    messagebar,
    actionmenu,
    breadcrumb,
    editedItemId,
    editedFirst,
    currentId,
    rootId,
    register,
    isLoading,
    isSelectionModeOn,
    toolbar,
    uploads,
})

export const getRegistrationError = (state) => {
    return state.registrationError
}
export const registrationInProgress = (state) => {
    return state.isRegistering
}

export const registrationIsDone = (state) => {
    return state.registrationDone
}

export const getRegisteredEmail = (state) => {
    return state.email
}

export const captchaIsVerified = (state) => {
    return state.captcha
}
export const getAuthenticatedUser = (state) => {
    return state.session.user
}

export const getChildrenItems = (state) => {
    return state.children.entities
}

export const getCurrentContentPath = (state) => {
    return state.Path
}

export const actionmenuIsOpen = (state) => {
    return state.open
}

export const getAnchorElement = (state) => {
    return state.anchorElement
}

export const getMenuPosition = (state) => {
    return state.position
}

export const getParentId = (state) => {
    return state.currentcontent.content.ParentId
}
export const getRootId = (state) => {
    return state.rootId
}
export const getBreadCrumbArray = (state) => {
    return state.breadcrumb
}
export const getCurrentId = (state) => {
    return state.currentId
}
export const getActionsOfAContent = (state) => {
    return state.actions
}
export const getActions = (state) => {
    return state.actions
}
export const getEditedItemId = (state) => {
    return state.editedItemId
}
export const getItemOnActionMenuIsOpen = (state) => {
    return state.id
}
export const getLoading = (state) => {
    return state.isLoading
}
export const getItemTitleOnActionMenuIsOpen = (state) => {
    return state.title
}
export const getIsSelectionModeOn = (state) => {
    return state.isSelectionModeOn
}
export const getAddNewActions = (state) => {
    return state.addnew
}
export const isEditedFirst = (state) => {
    return state.editedFirst
}
export const getMessageBarProps = (state) => {
    return state.messagebar
}
export const getToolbarActions = (state) => {
    return state && state.actions ? state.actions : []
}
export const getUserActions = (state) => {
    return state.userActions
}
