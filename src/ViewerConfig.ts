import { Repository } from '@sensenet/client-core'
import { File as SnFile} from '@sensenet/default-content-types'
import { Annotation, getStoreConfig, Highlight, PreviewImageData, Redaction, Shape } from '@sensenet/document-viewer-react'
import { v1 } from 'uuid'

/**
 * Adds a globally unique ID to the shape
 */
const addGuidToShape: <T extends Shape>(shape: T) => T = (shape) => {
    shape.guid = v1()
    return shape
}

export const getViewerStoreConfig = (repo: Repository) => getStoreConfig({
  saveChanges: async (documentData, pages) => {
    const reqBody = {
        Shapes: JSON.stringify([
            { redactions: documentData.shapes.redactions },
            { highlights: documentData.shapes.highlights },
            { annotations: documentData.shapes.annotations },
        ]),
        PageAttributes: JSON.stringify(pages.map((p) => p.Attributes && p.Attributes.degree && { pageNum: p.Index, options: p.Attributes } || undefined).filter((p) => p !== undefined)),
    }
    const response = repo.patch<SnFile>({
          idOrPath: documentData.idOrPath,
          content: reqBody,
      })
  },
  getDocumentData: async (settings) => {
        const documentData = (await repo.load<SnFile>({
            idOrPath: settings.idOrPath,
            oDataOptions: {
                select: 'all',
            },
        })).d

        return {
            idOrPath: settings.idOrPath,
            hostName: settings.hostName,
            fileSizekB: documentData.Size as number,
            pageCount: documentData.PageCount,
            documentName: documentData.DisplayName,
            documentType: documentData.Type,
            shapes: documentData.Shapes && {
                redactions: (JSON.parse(documentData.Shapes)[0].redactions as Redaction[]).map((a) => addGuidToShape(a)) || [],
                annotations: (JSON.parse(documentData.Shapes)[2].annotations as Annotation[]).map((a) => addGuidToShape(a)) || [],
                highlights: (JSON.parse(documentData.Shapes)[1].highlights as Highlight[]).map((a) => addGuidToShape(a)) || [],
            } || {
                    redactions: [],
                    annotations: [],
                    highlights: [],
                },
            pageAttributes: documentData.PageAttributes && JSON.parse(documentData.PageAttributes) || [],
        }
      },
      isPreviewAvailable: async (documentData, version, page: number, showWatermark) => {
        return await repo.executeAction<{ page: number}, PreviewImageData>({
            idOrPath: documentData.idOrPath,
            method: 'POST',
            name: `PreviewAvailable?version=${version}`,
            body: {
                page,
            },
        })
    },
    canEditDocument: async (settings) => ({} as any),
    canHideRedaction: async (settings) => ({} as any),
    canHideWatermark: async (settings) => ({} as any),
    getExistingPreviewImages: async (settings) => ({} as any),

})
