import { NotionAPI } from 'notion-client'
import { getCache, setCache } from './cache'

export async function getPostBlocks(id: string) {
  const cached = getCache<Awaited<ReturnType<NotionAPI['getPage']>>>(`block:${id}`)
  if (cached) return cached

  const api = new NotionAPI()
  const pageBlock = await api.getPage(id)

  // Notion API 응답 포맷 변경(value 이중 중첩)으로 react-notion-x가 block.id를 읽지 못하는 문제 해결
  for (const blockId of Object.keys(pageBlock.block)) {
    const block = pageBlock.block[blockId] as any
    if (block?.value?.value?.id !== undefined) {
      block.value = block.value.value
    }
  }

  setCache(`block:${id}`, pageBlock)
  return pageBlock
}
