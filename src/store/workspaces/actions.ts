import { Repository } from '@sensenet/client-core'
import { User, Workspace } from '@sensenet/default-content-types'
import { AnyAction } from 'redux'
import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from '../../'

export const getWorkspaces = () => ({
    type: 'GET_WORKSPACES',
    inject: async (options) => {
        if (!options.getState().dms.workspaces.isLoading) {
            options.dispatch(loadWorkspaces())
            const repository = options.getInjectable(Repository)
            const workspaces = await repository.loadCollection<Workspace>({
                path: '/',
                oDataOptions: {
                    query: 'TypeIs:Workspace -TypeIs:Site',
                    select: ['DisplayName', 'Id', 'Path'],
                    orderby: [['DisplayName', 'asc']],
                },
            })
            options.dispatch(setWorkspaces(workspaces.d.results))
        }
    },
} as InjectableAction<rootStateType, AnyAction>)

export const loadWorkspaces = () => ({
    type: 'LOAD_WORKSPACES',
})

export const setWorkspaces = (workspaces: Workspace[]) => ({
    type: 'SET_WORKSPACES',
    workspaces,
})

export const loadFavoriteWorkspaces = (userName: string) => ({
    type: 'LOAD_FAVORITE_WORKSPACES',
    inject: async (options) => {
        if (options.getState().dms.workspaces.favorites === null || options.getState().dms.workspaces.favorites.length === 0) {
            const repository = options.getInjectable(Repository)
            const favorites = await repository.load<User>({
                idOrPath: `/Root/IMS/Public/${userName}`,
                oDataOptions: {
                    select: 'FollowedWorkspaces',
                    expand: 'FollowedWorkspaces',
                },
            })
            options.dispatch(setFavoriteWorkspaces(favorites.d.FollowedWorkspaces as Workspace[]))
        }
    },
} as InjectableAction<rootStateType, AnyAction>)

export const setFavoriteWorkspaces = (workspaces: Workspace[]) => ({
    type: 'SET_FAVORITE_WORKSPACES',
    workspaces,
})

export const followWorkspace = (userName: string, contentId: number, followed: number[]) => ({
    type: 'FOLLOW_WORKSPACE',
    contentId,
    payload: (repository: Repository) => repository.patch<User>({
        idOrPath: `/Root/IMS/Public/${userName}`,
        content: {
            FollowedWorkspaces: [...followed, contentId],
        } as Partial<User>,
        oDataOptions: { select: 'FollowedWorkspaces', expand: 'FollowedWorkspaces' },
    }),
})

export const unfollowWorkspace = (userName: string, contentId: number, followed: number[]) => ({
    type: 'UNFOLLOW_WORKSPACE',
    contentId,
    payload: (repository: Repository) => repository.patch<User>({
        idOrPath: `/Root/IMS/Public/${userName}`,
        content: {
            FollowedWorkspaces: followed.length === 1 && followed[0] === contentId ? null : [...followed.filter((item) => item !== contentId)],
        } as Partial<User>,
        oDataOptions: { select: 'FollowedWorkspaces', expand: 'FollowedWorkspaces' },
    }),
})

export const searchWorkspaces = (text: string) => ({
    type: 'SEARCH_WORKSPACES',
    text,
})
