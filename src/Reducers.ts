import { IContent, IODataResponse } from '@sensenet/client-core'
import { IActionModel, Workspace } from '@sensenet/default-content-types'
import { createContent, deleteBatch, deleteContent, loadContent, loadContentActions, moveBatch, PromiseReturns } from '@sensenet/redux/dist/Actions'
import { Action, AnyAction, combineReducers, Reducer } from 'redux'
import { rootStateType } from '.'
import { closeMessageBar, ExtendedUploadProgressInfo, getWorkspaces, loadFavoriteWorkspaces, loadListActions, loadTypesToAddNewList, loadUserActions } from './Actions'
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

export const actions: Reducer<IActionModel[]> = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_ACTIONS_SUCCESS':
            const result: { d: { Actions: IActionModel[] } } = (action.result as PromiseReturns<typeof loadContentActions>) as any
            return result && result.d.Actions ? result.d.Actions : []
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

export const rootId: Reducer<number | null> = (state = null, action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            const result = action.result as PromiseReturns<typeof loadContent>
            if (!state && result && result.d.Path.indexOf('Default_Site') === -1) {
                return result.d.Id
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

export const breadcrumb: Reducer<BreadcrumbItemType[]> = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            const result = action.result as PromiseReturns<typeof loadContent>
            if (result) {
                if (result.d.Path.indexOf('Default_Site') === -1 && state.filter((e) => e.id === result.d.Id).length === 0) {
                    const element = {
                        name: result.d.DisplayName,
                        id: result.d.Id,
                        path: result.d.Path,
                    } as BreadcrumbItemType
                    return [...state, element]
                } else if (state.filter((e) => e.id === result.d.Id).length > 0) {
                    const index = state.findIndex((e) => e.id === result.d.Id) + 1
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

export const userActions: Reducer<IActionModel[]> = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_USER_ACTIONS_SUCCESS':
            const result = action.result as PromiseReturns<typeof loadUserActions>
            return result ? result.d.Actions : []
        default:
            return state
    }
}

export const addNewTypes = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_TYPES_TO_ADDNEW_LIST_SUCCESS':
            const result = action.result as PromiseReturns<typeof loadTypesToAddNewList>
            return result ? result.d.Actions : []
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
        case 'SET_MESSAGEBAR':
            return action.mode || state
        case 'CREATE_CONTENT_FAILURE':
        case 'DELETE_CONTENT_FAILURE':
        case 'LOAD_CONTENT_FAILURE':
        case 'FETCH_CONTENT_FAILURE':
        case 'UPDATE_CONTENT_FAILURE':
        case 'DELETE_BATCH_FAILURE':
        case 'COPY_CONTENT_FAILURE':
        case 'COPY_BATCH_FAILURE':
        case 'MOVE_CONTENT_FAILURE':
        case 'MOVE_BATCH_FAILURE':
        case 'CHECKOUT_CONTENT_FAILURE':
        case 'CHECKIN_CONTENT_FAILURE':
        case 'PUBLISH_CONTENT_FAILURE':
        case 'APPROVE_CONTENT_FAILURE':
        case 'REJECT_CONTENT_FAILURE':
        case 'UNDOCHECKOUT_CONTENT_FAILURE':
        case 'FORCE_UNDOCHECKOUT_CONTENT_FAILURE':
        case 'RESTOREVERSION_CONTENT_FAILURE':
        case 'MOVE_CONTENT_FAILURE':
        case 'MOVE_BATCH_FAILURE':
            return MessageMode.error
        case 'CREATE_CONTENT_SUCCESS':
        case 'DELETE_CONTENT_SUCCESS':
        case 'LOAD_CONTENT_SUCCESS':
        case 'FETCH_CONTENT_SUCCESS':
        case 'UPDATE_CONTENT_SUCCESS':
        case 'DELETE_BATCH_SUCCESS':
        case 'COPY_CONTENT_SUCCESS':
        case 'COPY_BATCH_SUCCESS':
        case 'MOVE_CONTENT_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
        case 'CHECKOUT_CONTENT_SUCCESS':
        case 'CHECKIN_CONTENT_SUCCESS':
        case 'PUBLISH_CONTENT_SUCCESS':
        case 'APPROVE_CONTENT_SUCCESS':
        case 'REJECT_CONTENT_SUCCESS':
        case 'UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'FORCE_UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'RESTOREVERSION_CONTENT_SUCCESS':
        case 'MOVE_CONTENT_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            return MessageMode.info
        default:
            return state
    }
}

export const messagebarcontent: Reducer<any[]> = (state = [], action) => {
    switch (action.type) {
        case 'SET_MESSAGEBAR':
            return action.content
        case 'CREATE_CONTENT_SUCCESS':
            // tslint:disable-next-line:no-string-literal
            return [`${(action.result as PromiseReturns<typeof createContent>).d['DisplayName']} is successfully created`]
        case 'DELETE_CONTENT_SUCCESS':
            return [`${(action.result as PromiseReturns<typeof deleteContent>).d.results[0].Name} is successfully deleted`]
        case 'DELETE_BATCH_SUCCESS':
            const result = action.result as PromiseReturns<typeof deleteBatch>
            return [
                ...result.d.errors.map((r) => `Cannot delete ${r.content.Name}, because '${r.error.message}'`),
                ...result.d.results.map((r) => `${r.Name} is successfully deleted`)]
        case 'CREATE_CONTENT_FAILURE':
        case 'DELETE_CONTENT_FAILURE':
        case 'LOAD_CONTENT_FAILURE':
        case 'FETCH_CONTENT_FAILURE':
        case 'UPDATE_CONTENT_FAILURE':
        case 'DELETE_BATCH_FAILURE':
            return `${(action.result as PromiseReturns<typeof deleteBatch>).d.errors[0].error}`
        case 'COPY_CONTENT_FAILURE':
        case 'COPY_BATCH_FAILURE':
        case 'MOVE_CONTENT_FAILURE':
        case 'MOVE_BATCH_FAILURE':
        case 'CHECKOUT_CONTENT_FAILURE':
        case 'CHECKIN_CONTENT_FAILURE':
        case 'PUBLISH_CONTENT_FAILURE':
        case 'APPROVE_CONTENT_FAILURE':
        case 'REJECT_CONTENT_FAILURE':
        case 'UNDOCHECKOUT_CONTENT_FAILURE':
        case 'FORCE_UNDOCHECKOUT_CONTENT_FAILURE':
        case 'RESTOREVERSION_CONTENT_FAILURE':
        case 'MOVE_CONTENT_FAILURE':
        case 'MOVE_BATCH_FAILURE':
            return `${(action.result as PromiseReturns<typeof moveBatch>).d.errors[0].error}`
        default:
            return state
    }
}

export const messagebaropen: Reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case 'OPEN_MESSAGEBAR':
            return true
        case 'CLOSE_MESSAGEBAR':
            return false
        case 'CREATE_CONTENT_FAILURE':
        case 'DELETE_CONTENT_FAILURE':
        case 'LOAD_CONTENT_FAILURE':
        case 'FETCH_CONTENT_FAILURE':
        case 'UPDATE_CONTENT_FAILURE':
        case 'DELETE_BATCH_FAILURE':
        case 'COPY_CONTENT_FAILURE':
        case 'COPY_BATCH_FAILURE':
        case 'MOVE_CONTENT_FAILURE':
        case 'MOVE_BATCH_FAILURE':
        case 'CHECKOUT_CONTENT_FAILURE':
        case 'CHECKIN_CONTENT_FAILURE':
        case 'PUBLISH_CONTENT_FAILURE':
        case 'APPROVE_CONTENT_FAILURE':
        case 'REJECT_CONTENT_FAILURE':
        case 'UNDOCHECKOUT_CONTENT_FAILURE':
        case 'FORCE_UNDOCHECKOUT_CONTENT_FAILURE':
        case 'RESTOREVERSION_CONTENT_FAILURE':
        case 'MOVE_CONTENT_FAILURE':
        case 'MOVE_BATCH_FAILURE':
        case 'CREATE_CONTENT_SUCCESS':
        case 'DELETE_CONTENT_SUCCESS':
        case 'UPDATE_CONTENT_SUCCESS':
        case 'DELETE_BATCH_SUCCESS':
        case 'COPY_CONTENT_SUCCESS':
        case 'COPY_BATCH_SUCCESS':
        case 'MOVE_CONTENT_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
        case 'CHECKOUT_CONTENT_SUCCESS':
        case 'CHECKIN_CONTENT_SUCCESS':
        case 'PUBLISH_CONTENT_SUCCESS':
        case 'APPROVE_CONTENT_SUCCESS':
        case 'REJECT_CONTENT_SUCCESS':
        case 'UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'FORCE_UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'RESTOREVERSION_CONTENT_SUCCESS':
        case 'MOVE_CONTENT_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            return true
        default:
            return state
    }
}

export const messagebarclose: Reducer<() => void | null> = (state = closeMessageBar, action) => {
    switch (action.type) {
        case 'SET_MESSAGEBAR':
            return action.close
        default:
            return state
    }
}

export const messagebarexited: Reducer<() => void | null> = (state = null, action) => {
    switch (action.type) {
        case 'SET_MESSAGEBAR':
            return action.exited
        default:
            return state
    }
}

export const hideDuration: Reducer<number> = (state = null, action) => {
    switch (action.type) {
        case 'SET_MESSAGEBAR':
            return action.hideDuration
        case 'CREATE_CONTENT_SUCCESS':
        case 'DELETE_CONTENT_SUCCESS':
        case 'LOAD_CONTENT_SUCCESS':
        case 'FETCH_CONTENT_SUCCESS':
        case 'UPDATE_CONTENT_SUCCESS':
        case 'DELETE_BATCH_SUCCESS':
        case 'COPY_CONTENT_SUCCESS':
        case 'COPY_BATCH_SUCCESS':
        case 'MOVE_CONTENT_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
        case 'CHECKOUT_CONTENT_SUCCESS':
        case 'CHECKIN_CONTENT_SUCCESS':
        case 'PUBLISH_CONTENT_SUCCESS':
        case 'APPROVE_CONTENT_SUCCESS':
        case 'REJECT_CONTENT_SUCCESS':
        case 'UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'FORCE_UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'RESTOREVERSION_CONTENT_SUCCESS':
        case 'MOVE_CONTENT_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            return null
        case 'CREATE_CONTENT_FAILURE':
        case 'DELETE_CONTENT_FAILURE':
        case 'LOAD_CONTENT_FAILURE':
        case 'FETCH_CONTENT_FAILURE':
        case 'UPDATE_CONTENT_FAILURE':
        case 'DELETE_BATCH_FAILURE':
        case 'COPY_CONTENT_FAILURE':
        case 'COPY_BATCH_FAILURE':
        case 'MOVE_CONTENT_FAILURE':
        case 'MOVE_BATCH_FAILURE':
        case 'CHECKOUT_CONTENT_FAILURE':
        case 'CHECKIN_CONTENT_FAILURE':
        case 'PUBLISH_CONTENT_FAILURE':
        case 'APPROVE_CONTENT_FAILURE':
        case 'REJECT_CONTENT_FAILURE':
        case 'UNDOCHECKOUT_CONTENT_FAILURE':
        case 'FORCE_UNDOCHECKOUT_CONTENT_FAILURE':
        case 'RESTOREVERSION_CONTENT_FAILURE':
        case 'MOVE_CONTENT_FAILURE':
        case 'MOVE_BATCH_FAILURE':
            return null
        default:
            return state
    }
}

export const messagebar = combineReducers({
    open: messagebaropen,
    mode: messagebarmode,
    content: messagebarcontent,
    close: messagebarclose,
    exited: messagebarexited,
    hideDuration,
})

export const toolbarActions: Reducer<IActionModel[]> = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_LIST_ACTIONS_SUCCESS':
            return (action.result as PromiseReturns<typeof loadListActions>).d.Actions
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

export const allWorkspaces: Reducer<Workspace[]> = (state: Workspace[], action: AnyAction) => {
    switch (action.type) {
        case 'GET_WORKSPACES_SUCCESS':
            return (action.result as PromiseReturns<typeof getWorkspaces>).d.results
        default:
            return state || []
    }
}

export const favorites: Reducer<number[]> = (state: number[], action: AnyAction) => {
    switch (action.type) {
        case 'LOAD_FAVORITE_WORKSPACES_SUCCESS':
        case 'FOLLOW_WORKSPACE_SUCCESS':
        case 'UNFOLLOW_WORKSPACE_SUCCESS':
            const items = (action.result as PromiseReturns<typeof loadFavoriteWorkspaces>).d.FollowedWorkspaces as any[]
            return items.map((item) => item.Id)
        default:
            return state || []
    }
}

export const searchTerm: Reducer<string> = (state: '', action: AnyAction) => {
    switch (action.type) {
        case 'SEARCH_WORKSPACES':
            return action.text
        default:
            return state || ''
    }
}

export const workspaces = combineReducers({
    favorites,
    all: allWorkspaces,
    searchTerm,
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
    workspaces,
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
