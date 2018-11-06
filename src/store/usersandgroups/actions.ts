import { IODataCollectionResponse, IODataParams, Repository } from '@sensenet/client-core'
import { ValueObserver } from '@sensenet/client-utils'
import { GenericContent, User } from '@sensenet/default-content-types'
import { EventHub } from '@sensenet/repository-events'
import { Action } from 'redux'
import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from '../..'
import { changedContent, debounceReloadOnProgress } from '../../Actions'

const eventObservables: Array<ValueObserver<any>> = []

export const startLoading = (idOrPath: number | string) => ({
    type: 'DMS_USERSANDGROUPS_LOADING',
    idOrPath,
})

export const loadUser: <T extends User = User>(idOrPath: string | number, userOptions?: IODataParams<T>) => InjectableAction<rootStateType, Action>
    = <T extends User = User>(idOrPath: number | string, userOptions?: IODataParams<T>) => ({
        type: 'DMS_USERSANDGROUPS_LOAD_USER',
        inject: async (options) => {

            const prevState = options.getState().dms.usersAndGroups
            if (prevState.user.currentUser && prevState.user.currentUser.Id.toString() === idOrPath) {
                return
            }

            eventObservables.forEach((o) => o.dispose())
            eventObservables.length = 0

            const eventHub = options.getInjectable(EventHub)

            options.dispatch(startLoading(idOrPath))

            try {
                const repository = options.getInjectable(Repository)
                const newUser = await repository.load<T>({
                    idOrPath,
                    oDataOptions: userOptions,
                })
                options.dispatch(setUser(newUser.d))
                const emitChange = (content: User) => {
                    changedContent.push(content)
                    debounceReloadOnProgress(options.getState, options.dispatch)
                }

                eventObservables.push(
                    eventHub.onCustomActionExecuted.subscribe((value) => {
                        emitChange({ Id: newUser.d.Id } as User)
                    }) as any,
                    eventHub.onContentCreated.subscribe((value) => emitChange(value.content)) as any,
                    eventHub.onContentModified.subscribe((value) => emitChange(value.content)) as any,
                    eventHub.onContentDeleted.subscribe((value) => {
                        const currentItems = options.getState().dms.usersAndGroups.user.memberships
                        const filtered = currentItems.d.results.filter((item) => item.Id !== value.contentData.Id)
                        options.dispatch(setMemberships(
                            {
                                ...currentItems,
                                d: {
                                    __count: filtered.length,
                                    results: filtered,
                                },
                            },
                        ))
                    }) as any,
                    eventHub.onContentMoved.subscribe((value) => emitChange(value.content)) as any,
                )

                await Promise.all([(async () => {
                    const ancestors = await repository.executeAction<undefined, IODataCollectionResponse<GenericContent>>({
                        idOrPath: newUser.d.Id,
                        method: 'GET',
                        name: 'Ancestors',
                        body: undefined,
                    })
                    options.dispatch(setAncestors([...ancestors.d.results, newUser.d]))
                })(),
                (async () => {
                    const items = await repository.executeAction({
                        name: 'GetParentGroups', idOrPath, body: {
                            directOnly: false,
                        }, method: 'GET',
                    })
                    options.dispatch(setMemberships(items as any))
                })(),
                ])

            } catch (error) {
                options.dispatch(setError(error))
            } finally {
                options.dispatch(finishLoading())
            }

        },
    })

export const setUser: <T extends User = User>(content: T) => Action & { content: T } = <T>(content: T) => ({
    type: 'DMS_USERSANDGROUPS_SET_USER',
    content,
})

export const setMemberships: <T extends GenericContent = GenericContent>(items: IODataCollectionResponse<T>) => Action & { items: IODataCollectionResponse<T> }
    = <T>(items: IODataCollectionResponse<T>) => ({
        type: 'DMS_USERSANDGROUPS_SET_MEMBERSHIPS',
        items,
    })

export const setAncestors = <T extends GenericContent>(ancestors: T[]) => ({
    type: 'DMS_USERSANDGROUPS_SET_ANCESTORS',
    ancestors,
})

export const setError = (error?: any) => ({
    type: 'DMS_USERSANDGROUPS_SET_ERROR',
    error,
})

export const finishLoading = () => ({
    type: 'DMS_USERSANDGROUPS_FINISH_LOADING',
})

export const setGroupOptions = <T extends GenericContent>(odataOptions: IODataParams<T>) => ({
    type: 'DMS_USERSANDGROUPS_SET_GROUP_OPTIONS',
    odataOptions,
})
