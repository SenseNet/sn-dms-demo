import { IODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

export const loadEditedContent = (id: number, options: IODataParams<GenericContent>) => ({
    type: 'LOAD_EDITED_CONTENT',
    payload: (repository: Repository) => repository.load({
        idOrPath: id,
        oDataOptions: options,
    }),
})
