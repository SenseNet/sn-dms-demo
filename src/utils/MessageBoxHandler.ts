import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import { EventHub } from '@sensenet/repository-events'
import { Store } from 'redux'
import { setMessageBar } from '../Actions'

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
                setMessageBar(MessageMode.error, [{ message: response.error.message }], null, null),
            )
        })

        this.eventHub.onContentDeleted.subscribe(() => {
            store.dispatch(
                setMessageBar(MessageMode.info, [{ message: 'Delete was successful' }], null, null),
            )
        })
    }
}
