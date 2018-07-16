import { IContent, IUploadFromEventOptions, IUploadFromFileListOptions, IUploadProgressInfo, Repository, Upload } from '@sensenet/client-core'
import { ObservableValue, usingAsync } from '@sensenet/client-utils'
import { File as SnFile, GenericContent } from '@sensenet/default-content-types'
import { IActionModel } from '@sensenet/default-content-types/dist/IActionModel'
import { Actions } from '@sensenet/redux'
import { Dispatch } from 'redux'

import { debounce } from 'lodash'

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
export const setCurrentId = (id) => ({
    type: 'SET_CURRENT_ID',
    id,
})
export const setEditedContentId = (id) => ({
    type: 'SET_EDITED_ID',
    id,
})
export const openActionMenu = (actions, id, title, element, position?, customItems?) => ({
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
export const setEditedFirst = (edited) => ({
    type: 'SET_EDITED_FIRST',
    edited,
})
export const openMessageBar = (mode: MessageMode, content, vertical?, horizontal?) => ({
    type: 'OPEN_MESSAGE_BAR',
    mode,
    content,
    vertical: vertical || 'bottom',
    horizontal: horizontal || 'left',
})
export const closeMessageBar = () => ({
    type: 'CLOSE_MESSAGE_BAR',
})
export const loadListActions = (idOrPath: number | string, scenario?: string, customActions?: IActionModel[]) => ({
    type: 'LOAD_LIST_ACTIONS',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<{ d: IActionModel[] }> {
        const data: any = await repository.getActions({ idOrPath, scenario })
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
        const data: any = await repository.getActions({ idOrPath, scenario })
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

export type ExtendedUploadProgressInfo = IUploadProgressInfo & { content?: GenericContent, visible?: boolean }

function methodToDebounce(parentId: number, getState, dispatch) {
    const currentId = getState().sensenet.currentcontent.content.Id
    if (currentId === parentId) {
        dispatch(Actions.requestContent(getState().sensenet.currentcontent.content.Path))
    }
}
const debounceReloadOnProgress = debounce(methodToDebounce, 2000)

export const trackUploadProgress = async <T extends GenericContent> (currentValue: ExtendedUploadProgressInfo, getState, dispatch, api: Repository) => {

    let currentUpload: ExtendedUploadProgressInfo = getState().dms.uploads.uploads.find((u) => u.guid === currentValue.guid)
    if (currentUpload) {
        dispatch(updateUploadItem(currentValue))
    } else {
        dispatch(addUploadItem({
            ...currentValue,
            visible: true,
        }))
    }

    currentUpload = getState().dms.uploads.uploads.find((u) => u.guid === currentValue.guid)
    if (currentValue.createdContent && !currentUpload.content) {
        const content = await api.load<T>({
            idOrPath: currentValue.createdContent.Id,
            oDataOptions: {
                select: ['Id', 'Path', 'DisplayName', 'Icon', 'Name', 'ParentId'],
            },
        })
        dispatch(updateUploadItem({ ...currentValue, content: content.d }))
        debounceReloadOnProgress(content.d.ParentId, getState, dispatch)
    }
}

export const uploadFileList = <T extends SnFile>(options: Pick<IUploadFromFileListOptions<T>, Exclude<keyof IUploadFromFileListOptions<T>, 'repository'>>) =>
    async (dispatch: Dispatch, getState: () => any, api: Repository) => {

        await usingAsync(new ObservableValue<IUploadProgressInfo>(), async (progress) => {
            progress.subscribe(async (currentValue) => trackUploadProgress(currentValue, getState, dispatch, api))
            try {
                await Upload.fromFileList({
                    ...options,
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
    }

export const uploadDataTransfer = <T extends SnFile>(options: Pick<IUploadFromEventOptions<T>, Exclude<keyof IUploadFromEventOptions<T>, 'repository'>>) =>
    async (dispatch: Dispatch, getState: () => any, api: Repository) => {
        await usingAsync(new ObservableValue<IUploadProgressInfo>(), async (progress) => {
            progress.subscribe(async (currentValue) => trackUploadProgress(currentValue, getState, dispatch, api))
            try {
                await Upload.fromDropEvent({
                    ...options,
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
    }
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
