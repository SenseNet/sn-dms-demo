
export const getContentTypeFromUrl = (urlString) => {
    const urlTemp = urlString.split('ContentTypeName=')[1]
    const type = urlTemp.indexOf('&') > -1 ? urlTemp.split('&')[0] : urlTemp
    return type.indexOf('ContentTemplates') > -1 ? type.split('/')[3] : type
}

export const fakeClick = (obj) => {
    const ev = document.createEvent('MouseEvents')
    ev.initMouseEvent('click', true, false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
    )
    obj.dispatchEvent(ev)
}

export const downloadFile = (name, repositoryUrl) => {
    const saveLink = document.createElement('a')
    // tslint:disable-next-line:no-string-literal
    saveLink['href'] = `${repositoryUrl}${name}?download`
    fakeClick(saveLink)
}
