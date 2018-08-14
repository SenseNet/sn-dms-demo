import { IODataCollectionResponse, IODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Action } from 'redux'
import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from '../..'

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
                    oDataOptions: prevState.parentOptions,
                })
                options.dispatch(setParent(newParent.d))

                const items = await repository.loadCollection({
                    path: newParent.d.Path,
                    oDataOptions: prevState.childrenOptions,
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

export const setActive = <T extends GenericContent>(active?: T) => ({
    type: 'DMS_DOCLIB_SET_ACTIVE',
    active,
})

export const updateChildrenOptions = <T extends GenericContent>(odataOptions: IODataParams<T>) => ({
    type: 'DMS_DOCLIB_UPDATE_CHILDREN_OPTIONS',
    odataOptions,
    inject: async (options) => {
        const currentState = options.getState()
        const parentPath = currentState.dms.documentLibrary.parent.Path
        const repository = options.getInjectable(Repository)
        options.dispatch(startLoading(currentState.dms.documentLibrary.parentIdOrPath))
        try {
            const items = await repository.loadCollection({
                path: parentPath,
                oDataOptions: odataOptions,
            })
            options.dispatch(setItems(items))
        } catch (error) {
            options.dispatch(setError(error))
        } finally {
            options.dispatch(finishLoading())
            options.dispatch(setChildrenOptions(odataOptions))
        }

        /** */
    },
} as InjectableAction<rootStateType, Action> & { odataOptions: IODataParams<GenericContent>})

export const setChildrenOptions = <T extends GenericContent>(odataOptions: IODataParams<T>) => ({
    type: 'DMS_DOCLIB_SET_CHILDREN_OPTIONS',
    odataOptions,
})
