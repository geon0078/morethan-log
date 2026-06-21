import CONFIG from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"
import getAllPageIds from "../utils/notion/getAllPageIds"
import getPageProperties from "../utils/notion/getPageProperties"
import { TPosts } from "@/src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

export async function getPosts() {
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()
  const response = await api.getPage(id)
  id = idToUuid(id)
  const collectionValue = Object.values(response.collection)[0]?.value as any
  const collection = collectionValue?.value ?? collectionValue
  const block = response.block
  const schema = collection?.schema

  const blockValue = (block[id].value as any)?.value ?? block[id].value
  const rawMetadata = blockValue

  // Check Type
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  } else {
    // collection_query가 비어있을 경우 getCollectionData를 직접 호출
    if (Object.keys(response.collection_query).length === 0) {
      const collectionId = Object.keys(response.collection)[0]
      const viewId = rawMetadata?.view_ids?.[0]
      if (collectionId && viewId) {
        const collectionView = (response.collection_view[viewId]?.value as any) || {}
        const collectionData = await api.getCollectionData(collectionId, viewId, collectionView)
        const reducerResults = (collectionData as any)?.result?.reducerResults
        if (reducerResults) {
          response.collection_query[collectionId] = { [viewId]: reducerResults }
        }
        if (collectionData?.recordMap?.block) {
          Object.assign(response.block, collectionData.recordMap.block)
        }
      }
    }

    // Construct Data
    const pageIds = getAllPageIds(response)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties = (await getPageProperties(id, block, schema)) || null
      // Add fullwidth, createdtime to properties
      const pageBlockValue = (block[id].value as any)?.value ?? block[id].value
      properties.createdTime = new Date(
        pageBlockValue?.created_time
      ).toString()
      properties.fullWidth =
        (pageBlockValue?.format as any)?.page_full_width ?? false

      data.push(properties)
    }

    // Sort by date
    data.sort((a: any, b: any) => {
      const dateA: any = new Date(a?.date?.start_date || a.createdTime)
      const dateB: any = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })
    return data as TPosts
  }
}
