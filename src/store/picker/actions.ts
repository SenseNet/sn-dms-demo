import { IODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

const pickerParentOptions: IODataParams<GenericContent> = {
    select: ['DisplayName', 'Path', 'Id', 'ParentId'],
    metadata: 'no',
}

const pickerItemOptions: IODataParams<GenericContent> = {
    select: ['DisplayName', 'Path', 'Id'],
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

export const loadPickerItems = (path) => ({
    type: 'LOAD_PICKER_ITEMS',
    payload: (repository: Repository) => repository.loadCollection({
        path,
        oDataOptions: pickerItemOptions,
    }),
})
