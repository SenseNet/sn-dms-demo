import { IODataCollectionResponse, IODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Action } from 'redux'
import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from '../..'

export const parentOdataOptions: IODataParams<GenericContent> = {
    select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner', 'VersioningMode'],
    expand: ['Actions', 'Owner'],
    orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
    filter: 'ContentType ne \'SystemFolder\'',
    scenario: 'DMSListItem',
}

export const listOdataOptions: IODataParams<GenericContent> = {
    select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner', 'VersioningMode'],
    expand: ['Actions', 'Owner'],
    orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
    filter: 'ContentType ne \'SystemFolder\'',
    scenario: 'DMSListItem',
}

export const startLoading = (idOrPath: number | string) => ({
    type: 'DMS_DOCLIB_LOADING',
    idOrPath,
})

export const finishLoading = () => ({
    type: 'DMS_DOCLIB_FINISH_LOADING',
})
export const loadParent: <T extends GenericContent = GenericContent>(idOrPath: string | number, options?: IODataParams<T>) => InjectableAction<rootStateType, Action>
    = <T extends GenericContent = GenericContent>(idOrPath: number | string) => ({
        type: 'DMS_DOCLIB_LOAD_PARENT',
        inject: async (options) => {
            const prevState = options.getState().dms.documentLibrary
            if (prevState.parentIdOrPath === idOrPath) {
                return
            }
            options.dispatch(startLoading(idOrPath))
            try {
                const repository = options.getInjectable(Repository)
                const newParent = await repository.load<T>({
                    idOrPath,
                })
                options.dispatch(setParent(newParent.d))

                const items = await repository.loadCollection({
                    path: newParent.d.Path,
                    oDataOptions: listOdataOptions,
                })
                options.dispatch(setItems(items))

            } catch (error) {
                options.dispatch(setError(error))
            } finally {
                options.dispatch(finishLoading())
            }

        },
    })

export const setParent: <T extends GenericContent = GenericContent>(content: T) => Action & { content: T } = <T>(content: T) => ({
    type: 'DMS_DOCLIB_SET_PARENT',
    content,
})

export const setItems: <T extends GenericContent = GenericContent>(items: IODataCollectionResponse<T>) => Action & { items: IODataCollectionResponse<T> }
    = <T>(items: IODataCollectionResponse<T>) => ({
        type: 'DMS_DOCLIB_SET_ITEMS',
        items,
    })

export const setError = (error?: any) => ({
    type: 'DMS_DOCLIB_SET_ERROR',
    error,
})

export const select = <T extends GenericContent>(selected: T[]) => ({
    type: 'DMS_DOCLIB_SELECT',
    selected,
})
