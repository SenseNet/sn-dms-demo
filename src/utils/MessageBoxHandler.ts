import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import { EventHub } from '@sensenet/repository-events'
import { Store } from 'redux'
import { openMessageBar } from '../Actions'

enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

export class MessageBoxHandler {
    private eventHub: EventHub
    constructor(repo: Repository, store: Store<any>) {
        this.eventHub = new EventHub(repo)

        this.eventHub.onContentCreated.subscribe((response) => {
            const currentContent: GenericContent = store.getState().sensenet.currentcontent.content
            if (currentContent.Id === (response.content as GenericContent).ParentId) {
                store.dispatch(Actions.requestContent(store.getState().sensenet.currentcontent.content.Path))
            }
        })

        this.eventHub.onContentDeleteFailed.subscribe((response) => {
            store.dispatch(
                openMessageBar(MessageMode.error, { message: response.error.message }),
            )
        })

        this.eventHub.onContentDeleted.subscribe(() => {
            store.dispatch(
                openMessageBar(MessageMode.info, { message: 'Delete was successful' }),
            )
        })
    }
}
