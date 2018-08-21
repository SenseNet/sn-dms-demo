import { IODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

const pickerParentOptions: IODataParams<GenericContent> = {
    select: ['DisplayName', 'Path', 'Id', 'ParentId', 'Workspace'],
    expand: ['Workspace'],
    metadata: 'no',
}

const pickerItemOptions: IODataParams<any> = {
    select: ['DisplayName', 'Path', 'Id', 'Children'],
    expand: ['Children'],
    // tslint:disable-next-line:quotemark
    filter: "isOf('Folder')",
    metadata: 'no',
}

export const openPicker = (content: any = '', onClose?: () => void) => ({
    type: 'OPEN_PICKER',
    content,
    onClose: onClose || null,
})

export const closePicker = () => ({
    type: 'CLOSE_PICKER',
})

export const setPickerParent = (content: GenericContent) => ({
    type: 'SET_PICKER_PARENT',
    content,
})

export const loadPickerParent = (idOrPath: string | number) => ({
    type: 'LOAD_PICKER_PARENT',
    payload: (repository: Repository) => repository.load({
        idOrPath,
        oDataOptions: pickerParentOptions,
    }),
})

export const loadPickerItems = (path: string, current: GenericContent, options?: IODataParams<any>) => ({
    type: 'LOAD_PICKER_ITEMS',
    payload: (repository: Repository) => repository.loadCollection({
        path,
        oDataOptions: {...pickerItemOptions, ...options},
    }),
    current,
})

export const selectPickerItem = (content: GenericContent) => ({
    type: 'SELECT_PICKER_ITEM',
    content,
})
