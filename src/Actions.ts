import { IUploadFromEventOptions, IUploadProgressInfo, Repository, Upload } from '@sensenet/client-core'
import { File as SnFile } from '@sensenet/default-content-types'

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
export const openActionMenu = (actions, id, title, position, customItems?) => ({
    type: 'OPEN_ACTIONMENU',
    actions: customItems && customItems.length > 0 ? customItems : actions,
    id,
    title,
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

export const uploadFileWithProgress = <T extends SnFile = SnFile>(options: Exclude<{ repository: Repository }, IUploadFromEventOptions<T>>) => ({
    // ToDo: Track progress with an observable
    // maybe with an upload uploader progress updater init?
    payload: async (repository: Repository) => {
        const uploadProgress = await Upload.fromDropEvent({
            ...options,
            repository,
        } as IUploadFromEventOptions<T>)
    },
})

export const addUploadItem = <T extends SnFile = SnFile>(uploadItem: IUploadProgressInfo<T>) => ({
    type: 'UPLOAD_ADD_ITEM',
    uploadItem,
})

export const updateUploadItem = <T extends SnFile = SnFile>(uploadItem: IUploadProgressInfo<T>) => ({
    type: 'UPLOAD_UPDATE_ITEM',
    uploadItem,
})

export const removeUploadItem = <T extends SnFile = SnFile>(uploadItem: IUploadProgressInfo<T>) => ({
    type: 'UPLOAD_REMOVE_ITEM',
    uploadItem,
})

export const showUploadProgress = () => ({
    type: 'UPLOAD_SHOW_PROGRESS',
})

export const hideUploadProgress = () => ({
    type: 'UPLOAD_HIDE_PROGRESS',
})
