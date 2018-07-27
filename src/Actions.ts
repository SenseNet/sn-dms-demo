import { IContent, IUploadFromEventOptions, IUploadFromFileListOptions, IUploadProgressInfo, Repository, Upload } from '@sensenet/client-core'
import { ObservableValue, usingAsync } from '@sensenet/client-utils'
import { File as SnFile, GenericContent } from '@sensenet/default-content-types'
import { IActionModel } from '@sensenet/default-content-types/dist/IActionModel'
import { Actions } from '@sensenet/redux'
import { Action, Dispatch } from 'redux'

import { debounce } from 'lodash'
import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from '.'

enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

export const userRegistration = (email: string, password: string) => ({
    type: 'USER_REGISTRATION_REQUEST',
    email,
    password,
    async payload(repository: Repository) {
        const data = await repository.executeAction({
            name: 'RegisterUser', idOrPath: `/Root/IMS('Public')`, body: {
                email,
                password,
            }, method: 'POST',
        })
    },
})
export const verifyCaptchaSuccess = () => ({
    type: 'VERIFY_CAPTCHA_SUCCESS',
})
export const clearRegistration = () => ({
    type: 'CLEAR_USER_REGISTRATION',
})
export const setCurrentId = (id: number | string) => ({
    type: 'SET_CURRENT_ID',
    id,
})
export const setEditedContentId = (id: number) => ({
    type: 'SET_EDITED_ID',
    id,
})
export const openActionMenu = (actions: any[], id: number, title: string, element: HTMLElement, position?: any, customItems?: any) => ({
    type: 'OPEN_ACTIONMENU',
    actions: customItems && customItems.length > 0 ? customItems : actions,
    id,
    title,
    element,
    position,
})
export const closeActionMenu = () => ({
    type: 'CLOSE_ACTIONMENU',
})
export const selectionModeOn = () => ({
    type: 'SELECTION_MODE_ON',
})
export const selectionModeOff = () => ({
    type: 'SELECTION_MODE_OFF',
})
export const setEditedFirst = (edited: boolean) => ({
    type: 'SET_EDITED_FIRST',
    edited,
})
export const openMessageBar = () => ({
    type: 'OPEN_MESSAGEBAR',
})
export const closeMessageBar = () => ({
    type: 'CLOSE_MESSAGEBAR',
})
export const setMessageBar = (mode: MessageMode, content: any, close?: () => void, exited?: () => void, hideDuration?: number) => ({
    type: 'SET_MESSAGEBAR',
    mode,
    content,
    close,
    exited,
    hideDuration,
})
export const loadListActions = (idOrPath: number | string, scenario?: string, customActions?: IActionModel[]) => ({
    type: 'LOAD_LIST_ACTIONS',
    async payload(repository: Repository): Promise<{ d: IActionModel[] }> {
        const data: { d: { Actions: IActionModel[] } } = await repository.getActions({ idOrPath, scenario }) as any
        const actions = customActions ? [...data.d.Actions, ...customActions] : data.d.Actions
        return {
            d: {
                Actions: actions.sort((a, b) => {
                    const x = a.Index
                    const y = b.Index
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
                }),
            } as any,
        }
    },
})
export const loadUserActions = (idOrPath: number | string, scenario?: string, customActions?: IActionModel[]) => ({
    type: 'LOAD_USER_ACTIONS',
    async payload(repository: Repository): Promise<{ d: IActionModel[] }> {
        const data: { d: { Actions: IActionModel[] } } = await repository.getActions({ idOrPath, scenario }) as any
        const actions = customActions ? [...data.d.Actions, ...customActions] : data.d.Actions
        return {
            d: {
                Actions: actions.sort((a: IActionModel, b: IActionModel) => {
                    const x = a.Index
                    const y = b.Index
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
                }),
            } as any,
        }
    },
})

export type ExtendedUploadProgressInfo = IUploadProgressInfo & { content?: GenericContent, visible?: boolean }

function methodToDebounce(parentId: number, getState: () => rootStateType, dispatch: Dispatch) {
    const currentId = getState().sensenet.currentcontent.content.Id
    if (currentId === parentId) {
        dispatch(Actions.requestContent(getState().sensenet.currentcontent.content.Path))
    }
}
const debounceReloadOnProgress = debounce(methodToDebounce, 2000)

export const trackUploadProgress = async <T extends GenericContent>(currentValue: ExtendedUploadProgressInfo, getState: () => rootStateType, dispatch: Dispatch, api: Repository) => {

    let currentUpload: ExtendedUploadProgressInfo | undefined = getState().dms.uploads.uploads.find((u) => u.guid === currentValue.guid)
    if (currentUpload) {
        dispatch(updateUploadItem(currentValue))
    } else {
        dispatch(addUploadItem({
            ...currentValue,
            visible: true,
        }))
    }

    currentUpload = getState().dms.uploads.uploads.find((u) => u.guid === currentValue.guid)
    if (currentUpload && currentValue.createdContent && !currentUpload.content) {
        const content = await api.load<T>({
            idOrPath: currentValue.createdContent.Id,
            oDataOptions: {
                select: ['Id', 'Path', 'DisplayName', 'Icon', 'Name', 'ParentId'],
            },
        })
        dispatch(updateUploadItem({ ...currentValue, content: content.d }))
        debounceReloadOnProgress(content.d.ParentId || 0, getState, dispatch)
    }
}

export const uploadFileList: <T extends SnFile>(uploadOptions: Pick<IUploadFromFileListOptions<T>, Exclude<keyof IUploadFromFileListOptions<T>, 'repository'>>) => InjectableAction<rootStateType, Action> =
    <T extends SnFile>(uploadOptions: Pick<IUploadFromFileListOptions<T>, Exclude<keyof IUploadFromFileListOptions<T>, 'repository'>>) => ({
        type: 'DMS_UPLOAD_FILE_LIST_INJECTABLE_ACTION',
        inject: async (options) => {
            const api = options.getInjectable(Repository)
            await usingAsync(new ObservableValue<IUploadProgressInfo>(), async (progress) => {
                progress.subscribe(async (currentValue) => trackUploadProgress(currentValue, options.getState, options.dispatch, api))
                try {
                    await Upload.fromFileList({
                        ...uploadOptions,
                        repository: api,
                        progressObservable: progress,
                    })
                } catch (error) {
                    progress.setValue({
                        ...progress.getValue(),
                        error,
                    })
                }
            })
        },
    })

export const uploadDataTransfer: <T extends SnFile>(options: Pick<IUploadFromEventOptions<T>, Exclude<keyof IUploadFromEventOptions<T>, 'repository'>>) => InjectableAction<rootStateType, Action>
    = <T extends SnFile>(uploadOptions: Pick<IUploadFromEventOptions<T>, Exclude<keyof IUploadFromEventOptions<T>, 'repository'>>) => ({
        type: 'DMS_UPLOAD_DATA_TRANSFER_INJECTABLE_ACTION',
        inject: async (options) => {
            const api = options.getInjectable(Repository)
            await usingAsync(new ObservableValue<IUploadProgressInfo>(), async (progress) => {
                progress.subscribe(async (currentValue) => trackUploadProgress(currentValue, options.getState, options.dispatch, api))
                try {
                    await Upload.fromDropEvent({
                        ...uploadOptions,
                        repository: api,
                        progressObservable: progress,
                    })
                } catch (error) {
                    progress.setValue({
                        ...progress.getValue(),
                        error,
                    })
                }
            })
        },
    })

export const addUploadItem = <T extends IContent>(uploadItem: ExtendedUploadProgressInfo) => ({
    type: 'UPLOAD_ADD_ITEM',
    uploadItem,
})

export const updateUploadItem = (uploadItem: ExtendedUploadProgressInfo) => ({
    type: 'UPLOAD_UPDATE_ITEM',
    uploadItem,
})

export const removeUploadItem = (uploadItem: ExtendedUploadProgressInfo) => ({
    type: 'UPLOAD_REMOVE_ITEM',
    uploadItem,
})

export const hideUploadItem = (uploadItem: ExtendedUploadProgressInfo) => ({
    type: 'UPLOAD_HIDE_ITEM',
    uploadItem,
})

export const showUploadProgress = () => ({
    type: 'UPLOAD_SHOW_PROGRESS',
})

export const hideUploadProgress = () => ({
    type: 'UPLOAD_HIDE_PROGRESS',
})

export const chooseMenuItem = (itemName: string) => ({
    type: 'CHOOSE_MENUITEM',
    itemName,
})

export const chooseSubmenuItem = (itemName: string) => ({
    type: 'CHOOSE_SUBMENUITEM',
    itemName,
})

export const openViewer = (id: number) => ({
    type: 'OPEN_VIEWER',
    id,
})

export const closeViewer = () => ({
    type: 'CLOSE_VIEWER',
})

export const loadTypesToAddNewList = (idOrPath: number | string) => ({
    type: 'LOAD_TYPES_TO_ADDNEW_LIST',
    async payload(repository: Repository): Promise<{ d: IActionModel[] }> {
        const data: any = await repository.getActions({ idOrPath, scenario: 'New' })
        return data
    },
})

export const openDialog = (content: any = '', title?: string, onClose?: () => void) => ({
    type: 'OPEN_DIALOG',
    title: title || '',
    content,
    onClose: onClose || null,
})

export const closeDialog = () => ({
    type: 'CLOSE_DIALOG',
})
export const setActionMenuId = (id: number | null) => ({
    type: 'SET_ACTIONMENU_ID',
    id,
})
