import { IODataParams, Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { DocumentLibrary, File as SnFile, Folder } from '@sensenet/default-content-types'
import { Action, Reducer } from 'redux'
import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from '..'

export const childrenODataOptions: IODataParams<SnFile | Folder> & {scenario: string} = {
    select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions', 'Owner', 'Actions', 'Owner'],
    expand: ['Actions', 'Owner'],
    orderby: [['IsFolder', 'desc'], ['DisplayName', 'asc']],
    filter:  'ContentType ne \'SystemFolder\'',
    scenario:  'DMSListItem',
}

export interface DocumentLibraryStore {
    currentFolder?: Folder
    currentDocumentLibrary?: DocumentLibrary
    children: Array<Folder | SnFile>
    selection: number[]
    error?: any
}

export const defaultDocumentLibraryState: DocumentLibraryStore = {
    selection: [],
    children: [],
}

export class DocumentLibraryActions {
    public static setDocumentLibrary: (idOrPath: string | number) => InjectableAction<rootStateType, Action> = (idOrPath) => ({
        type: 'DMS_DOCLIB_SET_DOCUMENT_LIBRARY_INJECTABLE_ACTION',
        inject: async (settings) => {
            const repository = settings.getInjectable(Repository)
            try {
                const result = await repository.load<DocumentLibrary>({
                    idOrPath,
                })
                const docLib = result.d
                settings.dispatch(DocumentLibraryActions.setDocumentLibrarySuccess(docLib))

                const currentFolder = settings.getState().dms.pages.documentLibrary.currentFolder
                if (!currentFolder || !PathHelper.isAncestorOf(docLib.Path, currentFolder.Path)) {
                    settings.dispatch(DocumentLibraryActions.setCurrentFolderSuccess(docLib))
                    settings.dispatch(DocumentLibraryActions.getChildren(docLib.Path))
                 }
            } catch (error) {
                settings.dispatch(DocumentLibraryActions.setDocumentLibraryError(error))
            }
        },
    })
    public static setDefaultDocumentLibraryForUser = (userName: string) => DocumentLibraryActions.setDocumentLibrary(`/Root/Profiles/Public/${userName}/Document_Library`)
    public static setDocumentLibraryError(error: any): Action & {error: any} {
        return {
            type: 'DMS_DOCLIB_SET_DOCUMENT_LIBRARY_ERROR',
            error,
        }
    }
    public static setDocumentLibrarySuccess(documentLibrary: DocumentLibrary): Action & {documentLibrary: DocumentLibrary} {
        return {
            type: 'DMS_DOCLIB_SET_DOCUMENT_LIBRARY_SUCCESS',
            documentLibrary,
        }
    }

    public static setCurrentFolder: (idOrPath: string | number) => InjectableAction<rootStateType, Action> = (idOrPath) => ({
        type: 'DMS_DOCLIB_SET_CURRENT_FOLDER_INJECTABLE_ACTION',
        inject: async (settings) => {
            const repository = settings.getInjectable(Repository)
            try {
                const result = await repository.load<Folder>({
                    idOrPath,
                })
                settings.dispatch(DocumentLibraryActions.setCurrentFolderSuccess(result.d))
            } catch (error) {
                settings.dispatch(DocumentLibraryActions.setCurrentFolderError(error))
            }
        },
    })

    public static setCurrentFolderError(error: any): Action & {error: any} {
        return {
            type: 'DMS_DOCLIB_SET_CURRENT_FOLDER_ERROR',
            error,
        }
    }

    public static setCurrentFolderSuccess(currentFolder: DocumentLibrary): Action & {currentFolder: Folder} {
        return {
            type: 'DMS_DOCLIB_SET_CURRENT_FOLDER_SUCCESS',
            currentFolder,
        }
    }

    public static getChildren(parentPath: string): InjectableAction<rootStateType, Action> {
        return {
            type: 'DMS_DOCLIB_GET_CHILDREN_INJECTABLE_ACTION',
            inject: async (options) => {
                const repo = options.getInjectable(Repository)
                try {
                    const result = await repo.loadCollection<SnFile | Folder>({
                        path: parentPath,
                        oDataOptions: childrenODataOptions,
                    })
                    options.dispatch(DocumentLibraryActions.getChildrenSuccess(result.d.results))
                } catch (error) {
                    options.dispatch(DocumentLibraryActions.getChildrenError(error))
                }
            },
        }
    }

    public static getChildrenSuccess(children: DocumentLibraryStore['children']): Action & {children: DocumentLibraryStore['children'] } {
        return {
            type: 'DMS_DOCLIB_GET_CHILDREN_SUCCESS',
            children,
        }
    }

    public static getChildrenError(error: any): Action & {error: any} {
        return {
            type: 'DMS_DOCLIB_GET_CHILDREN_ERROR',
            error,
        }
    }
}

export const documentLibraryReducer: Reducer<DocumentLibraryStore, Action> = (state = defaultDocumentLibraryState, action) => {
    switch (action.type) {
        case 'DMS_DOCLIB_SET_DOCUMENT_LIBRARY_SUCCESS':
            const docLib = (action as ReturnType<typeof DocumentLibraryActions['setDocumentLibrarySuccess']>).documentLibrary
            return {
                ...state,
                currentFolder: state.currentFolder || docLib,
                currentDocumentLibrary: docLib,
            }
        case 'DMS_DOCLIB_SET_CURRENT_FOLDER_SUCCESS':
            return {
                ...state,
                currentFolder: (action as ReturnType<typeof DocumentLibraryActions['setCurrentFolderSuccess']>).currentFolder,
            }
        case 'DMS_DOCLIB_GET_CHILDREN_SUCCESS':
            return {
                ...state,
                children: (action as ReturnType<typeof DocumentLibraryActions['getChildrenSuccess']>).children,
            }
        case 'DMS_DOCLIB_SET_DOCUMENT_LIBRARY_ERROR':
        case 'DMS_DOCLIB_SET_CURRENT_FOLDER_ERROR':
        case 'DMS_DOCLIB_GET_CHILDREN_ERROR':
            return {
                ...state,
                error: (action as Action & {error: any}).error,
            }
    }
    return state
}
