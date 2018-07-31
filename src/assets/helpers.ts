
export const getContentTypeFromUrl = (urlString) => {
    const urlTemp = urlString.split('ContentTypeName=')[1]
    const type = urlTemp.indexOf('&') > -1 ? urlTemp.split('&')[0] : urlTemp
    return type.indexOf('ContentTemplates') > -1 ? type.split('/')[3] : type
}
