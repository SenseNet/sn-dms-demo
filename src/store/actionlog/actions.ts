import { Repository } from '@sensenet/client-core'
import { isExtendedError } from '@sensenet/client-core/dist/Repository/Repository'
import { EventHub } from '@sensenet/repository-events'
import { InjectableAction } from 'redux-di-middleware'
import { rootStateType } from '../..'
import { resources } from '../../assets/resources'

export const logActions: string[] = ['CheckIn', 'Checkout', 'UndoCheckOut', 'Approve', 'Reject', 'Publish']

export interface MessageEntry {
    verbosity: 'info' | 'error'
    message: string
    bulkMessage?: string
}

export interface AddLogEntry {
    dump: any
    messageEntry?: MessageEntry
}

export interface LogEntry extends AddLogEntry {
    uuid: string
    created: Date
    unread: boolean
}

export const addLogEntry = (entry: AddLogEntry) => ({
    type: 'SN_DMS_ADD_LOG_ENTRY',
    entry,
})

export const readLogEntries = (entries: LogEntry[]) => ({
    type: 'SN_DMS_READ_LOG_ENTRIES',
    entries,
})

export const initLog: () => InjectableAction<rootStateType, ReturnType<typeof addLogEntry>> = () => ({
    type: 'SN_DMS_INIT_LOG',
    inject: async (options) => {
        const repository = options.getInjectable(Repository)
        const eventHub = new EventHub(repository)
        eventHub.onContentCreated.subscribe((ev) => {
            options.dispatch(addLogEntry({
                dump: ev,
                messageEntry: {
                    verbosity: 'info',
                    message: `${ev.content.Name} ${resources.CREATE_CONTENT_SUCCESS_MESSAGE}`,
                    bulkMessage: `{0} ${resources.ITEMS_ARE} ${resources.CREATE_CONTENT_SUCCESS_MULTIPLE_MESSAGE}`,
                },
            }))
        })
        eventHub.onContentCreateFailed.subscribe((ev) => {
            options.dispatch(addLogEntry({
                dump: ev,
                messageEntry: {
                    message: ev.error.message.value,
                    bulkMessage: `{0} ${resources.ITEMS} ${resources.CREATE_CONTENT_FAILURE_MESSAGE}`,
                    verbosity: 'error',
                },
            }))
        })
        eventHub.onContentCopied.subscribe((ev) => {
            options.dispatch(addLogEntry({
                dump: ev,
                messageEntry: {
                    message: `${ev.content.Name} ${resources.COPY_BATCH_SUCCESS_MESSAGE}`,
                    bulkMessage: `{0} ${resources.ITEMS} ${resources.COPY_BATCH_SUCCESS_MULTIPLE_MESSAGE}`,
                    verbosity: 'info',
                },
            }))
        })
        eventHub.onContentCopyFailed.subscribe((ev) => {
            options.dispatch(addLogEntry({
                dump: ev,
                messageEntry: {
                    message: ev.error.message.value, // `${ev.content.Name} ${resources.COPY_BATCH_FAILURE_MESSAGE}`,
                    bulkMessage: `{0} ${resources.ITEMS} ${resources.COPY_BATCH_FAILURE_MESSAGE}`,
                    verbosity: 'error',
                },
            }))
        })
        eventHub.onContentMoved.subscribe((ev) => {
            options.dispatch(addLogEntry({
                dump: ev,
                messageEntry: {
                    message: `${ev.content.Name} ${resources.MOVE_BATCH_SUCCESS_MESSAGE}`,
                    bulkMessage: `{0} ${resources.ITEMS} ${resources.MOVE_BATCH_SUCCESS_MULTIPLE_MESSAGE}`,
                    verbosity: 'info',
                },
            }))
        })
        eventHub.onContentMoveFailed.subscribe((ev) => {
            options.dispatch(addLogEntry({
                dump: ev,
                messageEntry: {
                    message: ev.error.message.value,
                    bulkMessage: `{0} ${resources.ITEMS} ${resources.MOVE_BATCH_FAILURE_MESSAGE}`,
                    verbosity: 'error',
                },
            }))
        })
        eventHub.onContentDeleted.subscribe((ev) => {
            options.dispatch(addLogEntry({
                dump: ev,
                messageEntry: {
                    message: `${ev.contentData.Name} ${resources.DELETE_BATCH_SUCCESS_MESSAGE}`,
                    bulkMessage: `{0} ${resources.ITEMS} ${resources.DELETE_BATCH_SUCCESS_MULTIPLE_MESSAGE}`,
                    verbosity: 'info',
                },
            }))
        })
        eventHub.onContentDeleteFailed.subscribe((ev) => {
            options.dispatch(addLogEntry({
                dump: ev,
                messageEntry: {
                    message: ev.error.message.value,
                    bulkMessage: `{0} ${resources.ITEMS} ${resources.DELETE_BATCH_SUCCESS_FAILED_MESSAGE}`,
                    verbosity: 'error',
                },
            }))
        })
        eventHub.onCustomActionExecuted.subscribe((ev) => {
            if (logActions.indexOf(ev.actionOptions.name) > -1) {

                const message = (resources[`${(ev.actionOptions.name).toUpperCase()}_SUCCESS_MESSAGE`] as string)
                    .replace('{contentName}', ev.result.d.Name)

                options.dispatch(addLogEntry({
                    dump: ev,
                    messageEntry: {
                        message,
                        bulkMessage: `{0} ${resources[`${(ev.actionOptions.name).toUpperCase()}_SUCCESS_MULTIPLE_MESSAGE`]}`,
                        verbosity: 'info',
                    },
                }))
            }
        })
        eventHub.onCustomActionFailed.subscribe((ev) => {
            if (logActions.indexOf(ev.actionOptions.name) > -1) {

                options.dispatch(addLogEntry({
                    dump: ev,
                    messageEntry: {
                        message: isExtendedError(ev.error) ? ev.error.toString() : ev.error.message.value || (resources[`${(ev.actionOptions.name).toUpperCase()}_FAILURE_MESSAGE`] as string),
                        bulkMessage: `{0} ${resources[`${(ev.actionOptions.name).toUpperCase()}_FAILURE_MULTIPLE_MESSAGE`]}`,
                        verbosity: 'info',
                    },
                }))
            }
        })
    },
})
