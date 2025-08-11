type CloudStorageAPI = {
  getItem: (key: string, callback: (err: unknown, value?: string | null) => void) => void
  setItem: (key: string, value: string, callback: (err: unknown, ok?: boolean) => void) => void
  removeItem: (key: string, callback: (err: unknown, ok?: boolean) => void) => void
}

const FAVORITES_KEY = 'favorites'

function getCloud(): CloudStorageAPI | undefined {
  // @ts-expect-error: Telegram types may be incomplete at runtime
  return window.Telegram?.WebApp?.CloudStorage
}

function parseList(value: string | null | undefined): string[] {
  try {
    return JSON.parse(value || '[]') as string[]
  } catch {
    return []
  }
}

export async function getFavorites(): Promise<string[]> {
  const cloud = getCloud()
  if (cloud) {
    const value = await new Promise<string | null>((resolve) => {
      try {
        cloud.getItem(FAVORITES_KEY, (_err, v) => resolve(v ?? null))
      } catch {
        resolve(null)
      }
    })
    const cloudList = parseList(value)
    if (cloudList.length > 0) {
      // Sync local cache
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(cloudList))
      } catch {}
      return cloudList
    }

    // If cloud is empty, try to bootstrap from localStorage cache
    let localList: string[] = []
    try {
      localList = parseList(localStorage.getItem(FAVORITES_KEY))
    } catch {
      localList = []
    }
    if (localList.length > 0) {
      // Push local cache to cloud for persistence
      await new Promise<void>((resolve) => {
        try {
          cloud.setItem(FAVORITES_KEY, JSON.stringify(localList), () => resolve())
        } catch {
          resolve()
        }
      })
      return localList
    }
    return []
  }
  // Fallback
  try {
    return parseList(localStorage.getItem(FAVORITES_KEY))
  } catch {
    return []
  }
}

export async function setFavorites(ids: string[]): Promise<void> {
  const payload = JSON.stringify(ids)
  const cloud = getCloud()
  if (cloud) {
    await new Promise<void>((resolve) => {
      try {
        cloud.setItem(FAVORITES_KEY, payload, () => resolve())
      } catch {
        resolve()
      }
    })
  }
  try {
    localStorage.setItem(FAVORITES_KEY, payload)
  } catch {}

  // Notify listeners in the app
  try {
    window.dispatchEvent(new CustomEvent('favoritesUpdated'))
  } catch {}
}

export async function toggleFavorite(id: string): Promise<string[]> {
  const list = await getFavorites()
  const exists = list.includes(String(id))
  const next = exists ? list.filter(x => x !== String(id)) : [...list, String(id)]
  await setFavorites(next)
  return next
}

export async function removeFavorite(id: string): Promise<string[]> {
  const list = await getFavorites()
  const next = list.filter(x => x !== String(id))
  await setFavorites(next)
  return next
}


