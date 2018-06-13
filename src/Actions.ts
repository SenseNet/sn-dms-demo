import { IContent, IUploadFromFileListOptions, IUploadProgressInfo, Repository, Upload } from '@sensenet/client-core'
import { ObservableValue, usingAsync } from '@sensenet/client-utils'
import { File as SnFile, GenericContent } from '@sensenet/default-content-types'
import { Dispatch } from 'redux'

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

export type ExtendedUploadProgressInfo = IUploadProgressInfo & { content?: GenericContent }

export const uploadFileList = <T extends SnFile>(options: Pick<IUploadFromFileListOptions<T>, Exclude<keyof IUploadFromFileListOptions<T>, 'repository'>>) =>
    async (dispatch: Dispatch<{}>, getState: () => any, api: Repository) => {
        usingAsync(new ObservableValue<IUploadProgressInfo>(), async (progress) => {
            progress.subscribe(async (currentValue) => {
                const currentUpload: ExtendedUploadProgressInfo = getState().dms.uploads.uploads.find((u) => u.guid === currentValue.guid)
                if (currentUpload) {
                    dispatch(updateUploadItem(currentValue))
                } else {
                    dispatch(addUploadItem({
                        ...currentValue,
                    }))
                }
                if (currentValue.createdContent && !currentUpload.content) {
                    const content = await api.load<T>({
                        idOrPath: currentValue.createdContent.Id,
                        oDataOptions: {
                            select: ['Id', 'Path', 'DisplayName', 'Icon', 'Name'],
                        },
                    })
                    dispatch(updateUploadItem({ ...currentValue, content: content.d }))
                }
            })
            await Upload.fromFileList({
                ...options,
                repository: api,
                progressObservable: progress,
            })
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

export const showUploadProgress = () => ({
    type: 'UPLOAD_SHOW_PROGRESS',
})

export const hideUploadProgress = () => ({
    type: 'UPLOAD_HIDE_PROGRESS',
})
