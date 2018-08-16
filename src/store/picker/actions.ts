
export const openPicker = (content: any = '', title?: string, onClose?: () => void) => ({
    type: 'OPEN_PICKER',
    title: title || '',
    content,
    onClose: onClose || null,
})

export const closePicker = () => ({
    type: 'CLOSE_PICKER',
})
