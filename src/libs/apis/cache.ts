const TTL = 60_000

// globalThis를 사용해 dev 모드 모듈 재컴파일 시에도 캐시가 유지됩니다
const g = globalThis as any
if (!g.__notionCache) g.__notionCache = new Map<string, { data: unknown; ts: number }>()
const store: Map<string, { data: unknown; ts: number }> = g.__notionCache

export function getCache<T>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > TTL) {
    store.delete(key)
    return null
  }
  return entry.data as T
}

export function setCache(key: string, data: unknown): void {
  store.set(key, { data, ts: Date.now() })
}
