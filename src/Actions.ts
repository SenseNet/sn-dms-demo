import { Repository } from '@sensenet/client-core'
import { IActionModel } from '@sensenet/default-content-types/dist/IActionModel'

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
