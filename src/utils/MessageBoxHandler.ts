import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import { EventHub } from '@sensenet/repository-events'
import { Store } from 'redux'
import { setMessageBar } from '../Actions'
import { resources } from '../assets/resources'

enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

export class MessageBoxHandler {
    private eventHub: EventHub
    constructor(repo: Repository, store: Store<any>) {
        this.eventHub = new EventHub(repo)

        this.eventHub.onContentCreated.subscribe((response) => {
            const currentContent: GenericContent = store.getState().sensenet.currentcontent.content
            if (currentContent && currentContent.Id === (response.content as GenericContent).ParentId) {
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

        this.eventHub.onCustomActionFailed.subscribe((response) => {
            const message = response.error.message.length > 0 ? response.error.message : resources[`${(response.actionOptions.name).toUpperCase()}_FAILURE_MESSAGE`]
            store.dispatch(
                setMessageBar(MessageMode.error, [message], null, null),
            )
        })

        this.eventHub.onContentModificationFailed.subscribe((response) => {
            const message = response.error.message.length > 0 ? response.error.message : `${response.content.Name} ${resources.EDIT_PROPERTIES_FAILURE_MESSAGE}`
            store.dispatch(
                setMessageBar(MessageMode.error, [message], null, null),
            )
        })

        this.eventHub.onContentMoved.subscribe(() => {
            store.dispatch(
                setMessageBar(MessageMode.info, [{ message: 'Content item(s) was/were moved successfuly' }], null, null),
            )
        })
        this.eventHub.onContentMoveFailed.subscribe((response) => {
            store.dispatch(
                setMessageBar(MessageMode.error, [{ message: response.error.message }], null, null),
            )
        })

        this.eventHub.onContentCopied.subscribe(() => {
            store.dispatch(
                setMessageBar(MessageMode.info, [{ message: 'Content item(s) was/were copied successfuly' }], null, null),
            )
        })
        this.eventHub.onContentCopyFailed.subscribe((response) => {
            store.dispatch(
                setMessageBar(MessageMode.error, [{ message: response.error.message }], null, null),
            )
        })
    }
}
