import { IContent, IODataResponse } from '@sensenet/client-core'
import { GenericContent, IActionModel } from '@sensenet/default-content-types'
import { Action, AnyAction, combineReducers, Reducer } from 'redux'
import { rootStateType } from '.'
import { ExtendedUploadProgressInfo } from './Actions'
import { resources } from './assets/resources'

enum MessageMode { error, warning, info }

export const email: Reducer<string, Action & { email?: string }> = (state = '', action) => {
    switch (action.type) {
        case 'USER_REGISTRATION_REQUEST':
            return action.email || state
        case 'USER_REGISTRATION_SUCCESS':
        case 'USER_REGISTRATION_FAILURE':
            return state
        default:
            return state
    }
}
export const registrationError: Reducer<string | null, Action> = (state = null, action) => {
    switch (action.type) {
        case 'USER_REGISTRATION_FAILURE':
            return resources.USER_IS_ALREADY_REGISTERED
        default:
            return state
    }
}
export const isRegistering: Reducer<boolean> = (state = false, action) => {
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

export const registrationDone: Reducer<boolean> = (state = false, action) => {
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

export const captcha: Reducer<boolean> = (state = false, action) => {
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

export const open: Reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return true
        case 'CLOSE_ACTIONMENU':
            return false
        default:
            return state
    }
}

export const actions: Reducer<IActionModel[], Action & { payload?: { d: { Actions: IActionModel[] } }, actions?: IActionModel[] }> = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_ACTIONS_SUCCESS':
            return action.payload && action.payload.d.Actions ? action.payload.d.Actions : []
        case 'OPEN_ACTIONMENU':
            return action.actions || []
        default:
            return state
    }
}

export const id: Reducer<number | null, Action & { id?: number }> = (state = null, action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return action.id || null
        default:
            return state
    }
}

export const title: Reducer<string, Action & { title?: string }> = (state = '', action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return action.title || state
        default:
            return state
    }
}

export const anchorElement: Reducer<HTMLElement | null, Action & { element?: HTMLElement | null }> = (state = null, action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return action.element || state
        default:
            return state
    }
}

export const position: Reducer<any, Action & { position?: any }> = (state = null, action) => {
    switch (action.type) {
        case 'OPEN_ACTIONMENU':
            return action.position || null
        default:
            return state
    }
}

export const rootId: Reducer<number | null, Action & { payload?: IODataResponse<IContent> }> = (state = null, action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            if (!state && action.payload && action.payload.d.Path.indexOf('Default_Site') === -1) {
                return action.payload.d.Id
            } else {
                return state
            }
        default:
            return state
    }
}

export const currentId: Reducer<number | null, Action & { id?: number }> = (state = null, action) => {
    switch (action.type) {
        case 'SET_CURRENT_ID':
            return action.id || state
        default:
            return state
    }
}

export const editedItemId: Reducer<number | null, Action & { id?: number }> = (state = null, action) => {
    switch (action.type) {
        case 'SET_EDITED_ID':
            return action.id || null
        case 'UPDATE_CONTENT_SUCCESS':
            return null
        default:
            return state
    }
}

export const editedFirst: Reducer<boolean, Action & { id?: number, edited?: boolean }> = (state = false, action) => {
    switch (action.type) {
        case 'SET_EDITED_ID':
            return action.id ? true : false
        case 'SET_EDITED_FIRST':
            return action.edited || state
        case 'UPDATE_CONTENT_SUCCESS':
            return false
        default:
            return state
    }
}

export interface BreadcrumbItemType { name: string, id: number, path: string }
export const breadcrumb: Reducer<BreadcrumbItemType[], Action & { payload?: IODataResponse<GenericContent> }> = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            if (action.payload) {
                const payload = action.payload
                if (payload.d.Path.indexOf('Default_Site') === -1 && state.filter((e) => e.id === payload.d.Id).length === 0) {
                    const element = {
                        name: action.payload.d.DisplayName,
                        id: action.payload.d.Id,
                        path: action.payload.d.Path,
                    } as BreadcrumbItemType
                    return [...state, element]
                } else if (state.filter((e) => e.id === payload.d.Id).length > 0) {
                    const index = state.findIndex((e) => e.id === payload.d.Id) + 1
                    return [...state.slice(0, index)]
                }
            } else {
                return state
            }
        default:
            return state
    }
}

export const isLoading: Reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            return false
        case 'LOAD_CONTENT_REQUEST':
            return true
        default:
            return state
    }
}

export const isSelectionModeOn: Reducer<boolean> = (state = false, action) => {
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

export const userActions: Reducer<IActionModel[], Action & { payload: { d: { Actions: IActionModel[] } } }> = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_USER_ACTIONS_SUCCESS':
            return action.payload.d.Actions ? action.payload.d.Actions : []
        default:
            return state
    }
}

export const addNewTypes = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_TYPES_TO_ADDNEW_LIST_SUCCESS':
            return action.payload.d.Actions ? action.payload.d.Actions : []
        default:
            return state
    }
}

export const actionmenuId: Reducer<number | null> = (state = null, action) => {
    switch (action.type) {
        case 'SET_ACTIONMENU_ID':
            return action.id
        default:
            return state
    }
}

export const actionmenu = combineReducers({
    actions,
    open,
    anchorElement,
    position,
    id: actionmenuId,
    title,
    userActions,
    addNewTypes,
})

export const messagebarmode: Reducer<MessageMode, Action & { mode?: MessageMode }> = (state = MessageMode.info, action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return action.mode || state
        case 'CLOSE_MESSAGE_BAR':
            return MessageMode.info
        default:
            return state
    }
}

export const messagebarcontent: Reducer<{}, Action & { content: {} }> = (state = {}, action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return action.content
        case 'CLOSE_MESSAGE_BAR':
            return {}
        default:
            return state
    }
}

export const messagebaropen: Reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return true
        case 'CLOSE_MESSAGE_BAR':
            return false
        default:
            return state
    }
}

export type verticalValues = 'top' | 'bottom'
export const vertical: Reducer<verticalValues, Action & { vertical: verticalValues }> = (state = 'bottom', action) => {
    switch (action.type) {
        case 'OPEN_MESSAGE_BAR':
            return action.vertical
        default:
            return state
    }
}

export type horizontalValues = 'left' | 'right'
export const horizontal: Reducer<horizontalValues, Action & { horizontal: horizontalValues }> = (state = 'left', action) => {
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

export const toolbarActions: Reducer<IActionModel[], Action & { payload: { d: { Actions: IActionModel[] } } }> = (state = [], action) => {
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

export const uploads: Reducer<{ uploads: ExtendedUploadProgressInfo[], showProgress: boolean }>
    = (state = { uploads: [], showProgress: false }, action: AnyAction) => {
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

export const activeMenuItem: Reducer<string, Action & { itemName?: string }> = (state = 'documents', action) => {
    switch (action.type) {
        case 'CHOOSE_MENUITEM':
            return action.itemName || state
        default:
            return state
    }
}

export const activeSubmenu: Reducer<string | null, Action & { itemName?: string }> = (state = null, action) => {
    switch (action.type) {
        case 'CHOOSE_SUBMENUITEM':
            return action.itemName || state
        default:
            return state
    }
}

export const menu = combineReducers({
    active: activeMenuItem,
    activeSubmenu,
})

export const viewer: Reducer<{ isOpened: boolean, currentDocumentId: number }, Action & { id?: number }> = (state = { isOpened: false, currentDocumentId: 0 }, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_VIEWER':
            return {
                ...state,
                isOpened: true,
                currentDocumentId: action.id,
            }
        case 'CLOSE_VIEWER':
            return {
                ...state,
                isOpened: false,
            }
    }
    return state
}

export const isOpened = (state: boolean = false, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_DIALOG':
            return true
        case 'CLOSE_DIALOG':
            return false
    }
    return state
}

export const onClose = (state: () => void = null, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_DIALOG':
            return action.onClose
        case 'CLOSE_DIALOG':
            return null
    }
    return state
}

export const dialogContent = (state: any = '', action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_DIALOG':
            return action.content
        case 'CLOSE_DIALOG':
            return state
    }
    return state
}

export const dialogTitle = (state: string = '', action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_DIALOG':
            return action.title
        case 'CLOSE_DIALOG':
            return {}
    }
    return state
}

export const dialog = combineReducers({
    isOpened,
    onClose,
    content: dialogContent,
    title: dialogTitle,
})

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
    menu,
    viewer,
    dialog,
})

export const getRegistrationError = (state: { registrationError: ReturnType<typeof register>['registrationError'] }) => {
    return state.registrationError
}
export const registrationInProgress = (state: { isRegistering: ReturnType<typeof register>['isRegistering'] }) => {
    return state.isRegistering
}

export const registrationIsDone = (state: { registrationDone: ReturnType<typeof register>['registrationDone'] }) => {
    return state.registrationDone
}

export const getRegisteredEmail = (state: { email: ReturnType<typeof register>['email'] }) => {
    return state.email
}

export const captchaIsVerified = (state: { captcha: ReturnType<typeof register>['captcha'] }) => {
    return state.captcha
}
export const getAuthenticatedUser = (state: { session: { user: rootStateType['sensenet']['session']['user'] } }) => {
    return state.session.user
}

export const getChildrenItems = (state: { currentitems: { entities: rootStateType['sensenet']['currentitems']['entities'] } }) => {
    return state.currentitems.entities
}

export const getCurrentContentPath = (state: { Path: string }) => {
    return state.Path
}

export const actionmenuIsOpen = (state: { open: ReturnType<typeof actionmenu>['open'] }) => {
    return state.open
}

export const getAnchorElement = (state: { anchorElement: ReturnType<typeof actionmenu>['anchorElement'] }) => {
    return state.anchorElement
}

export const getMenuPosition = (state: { position: ReturnType<typeof actionmenu>['position'] }) => {
    return state.position
}

export const getParentId = (state: { currentcontent }) => {
    return state.currentcontent.content.ParentId
}
export const getRootId = (state: { rootId: rootStateType['dms']['rootId'] }) => {
    return state.rootId
}
export const getBreadCrumbArray = (state: { breadcrumb: rootStateType['dms']['breadcrumb'] }) => {
    return state.breadcrumb
}
export const getCurrentId = (state: { currentId: rootStateType['dms']['currentId'] }) => {
    return state.currentId
}
export const getActionsOfAContent = (state: { actions: string[] }) => {
    return state.actions
}
export const getActions = (state: { actions: IActionModel[] }) => {
    return state.actions
}
export const getEditedItemId = (state: { editedItemId: ReturnType<typeof dms>['editedItemId'] }) => {
    return state.editedItemId
}
export const getItemOnActionMenuIsOpen = (state: { id: ReturnType<typeof actionmenu>['id'] }) => {
    return state.id
}
export const getLoading = (state: { isLoading: ReturnType<typeof dms>['isLoading'] }) => {
    return state.isLoading
}
export const getItemTitleOnActionMenuIsOpen = (state: { title: ReturnType<typeof actionmenu>['title'] }) => {
    return state.title
}
export const getIsSelectionModeOn = (state: { isSelectionModeOn: ReturnType<typeof dms>['isSelectionModeOn'] }) => {
    return state.isSelectionModeOn
}
export const getAddNewActions = (state: { addnew: any }) => {
    return state.addnew
}
export const isEditedFirst = (state: ReturnType<typeof dms>) => {
    return state.editedFirst
}
export const getMessageBarProps = (state: ReturnType<typeof dms>) => {
    return state.messagebar
}
export const getToolbarActions = (state: ReturnType<typeof actionmenu>) => {
    return state && state.actions ? state.actions : []
}
export const getUserActions = (state: ReturnType<typeof actionmenu>) => {
    return state.userActions
}

export const getActiveMenuItem = (state: ReturnType<typeof menu>) => {
    return state.active
}

export const getActiveSubmenuItem = (state: ReturnType<typeof menu>) => {
    return state.activeSubmenu
}
export const getAddNewTypeList = (state) => {
    return state.addNewTypes
}
export const getMenuAnchorId = (state) => {
    return state.actionmenu.id
}
