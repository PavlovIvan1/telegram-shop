import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { BRAND_COLOR } from '../../../constants/colors'
import { API_URL } from '../../../constants/url.constants'
import type { Product } from '../../../data/products'
import { addBackendProduct } from '../../../data/products'
import { ProductCard } from '../../ProductCard/ProductCard'
import { TopBar } from '../TopBar/TopBar'

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const [sortOption, setSortOption] = useState('name-asc')
  // const [filterCategory, setFilterCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Форматируем цену
  const formatPrice = (priceNumber: number): string => {
    return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
  }

  // Парсинг товаров
  const parseProducts = (items: Record<string, any>): Product[] => {
    return Object.values(items).map((item: any) => {
      const raw = item.link_to_photos || item.link_to_photo || ''
      const list = raw.split(';').map((s: string) => s.trim()).filter(Boolean)
      const first = list[0] || ''

      return {
        id: item.nm_id.toString(),
        name: item.name,
        price: formatPrice(item.price),
        image: first,
        images: list.length > 0 ? list : undefined,
        video: item.link_to_video || undefined,
        link: item.link || undefined,
        description: item.description || undefined,
        rating: item.nmReviewRating || undefined,
        reviewsCount: item.nmFeedbacks || undefined,
        lastFeedbackText: item.text_of_last_feedback || undefined,
        lastFeedbackRecentRating: item.rate_of_last_feedback || undefined,
        category: '',
        tags: [],
      }
    })
  }

  // Запрос к /init_search (GET)
  const fetchInitSearch = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_URL}/init_search`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      if (data.status !== 'ok') {
        throw new Error(data.result || 'Ошибка при запросе /init_search')
      }

      console.log('Получены данные из /init_search:', data)

      const productsArray = parseProducts(data.items || {})

      productsArray.forEach(product => {
        addBackendProduct(product)
      })

      setProducts(productsArray)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

//   const fetchHandle = async (searchText: string) => {
//   try {
//     setLoading(true)
//     setError(null)

//     const tg = (window as any).Telegram?.WebApp
//     const user = tg?.initDataUnsafe?.user

//     const handleRes = await fetch(`${API_URL}/handle`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         query_id: tg?.initDataUnsafe?.query_id ?? null,
//         user_id: user?.id ? String(user.id) : '0',      // отправляем строкой
//         username: user?.username ?? null,               // опционально
//         first_name: user?.first_name ?? null,           // опционально
//         last_name: user?.last_name ?? null,             // опционально
//         search_text: searchText || 'айфон',
//       }),
//     })

//     const handleData = await handleRes.json()
//     if (handleData.status !== 'ok') {
//       throw new Error(handleData.result || 'Ошибка при запросе /handle')
//     }

//     console.log('Полученные данные из /handle:', handleData)

//     const productsArray = parseProducts(handleData.items || {})
//     productsArray.forEach(product => addBackendProduct(product))
//     setProducts(productsArray)
//   } catch (err) {
//     setError((err as Error).message)
//   } finally {
//     setLoading(false)
//   }
// }

  // Запрос к /handle (POST)
  const fetchHandle = async (searchText: string) => {
    try {
      setLoading(true)
      setError(null)

      const handleRes = await fetch(`${API_URL}/handle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_id: window.Telegram?.WebApp?.initDataUnsafe?.query_id,
          user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
          username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username ?? null,
          first_name: window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name ?? null,
          last_name: window.Telegram?.WebApp?.initDataUnsafe?.user?.last_name ?? null,
          search_text: searchText || 'айфон',
        }),
      })

      const handleData = await handleRes.json()
      if (handleData.status !== 'ok') {
        throw new Error(handleData.result || 'Ошибка при запросе /handle')
      }

      console.log('Полученные данные из /handle:', handleData)

      const productsArray = parseProducts(handleData.items || {})

      productsArray.forEach(product => {
        addBackendProduct(product)
      })

      setProducts(productsArray)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Определяем, какой запрос вызывать
  const fetchProducts = (searchText: string) => {
    if (!searchText.trim()) {
      fetchInitSearch()
    } else {
      fetchHandle(searchText)
    }
  }

  // При изменении searchParams
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearchValue(q)
    fetchProducts(q) // Вызываем нужный запрос в зависимости от `q`
  }, [searchParams])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchProducts(searchValue)
      const next = new URLSearchParams(searchParams)
      if (searchValue) next.set('q', searchValue)
      else next.delete('q')
      setSearchParams(next)
    }
  }

  const filteredProducts = products
    .filter(product => {
      const search = searchValue.toLowerCase().trim()
      if (!search) return true

      return (
        product.name.toLowerCase().includes(search) ||
        product.price.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search) ||
        product.tags?.some(tag => tag.toLowerCase().includes(search))
      )
    })

  const parsePrice = (priceStr: string): number => {
    return Number(priceStr.replace(/[^\d]/g, ''))
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'price-asc':
        return parsePrice(a.price) - parsePrice(b.price)
      case 'price-desc':
        return parsePrice(b.price) - parsePrice(a.price)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <BeatLoader color={BRAND_COLOR} size={10} />
      </div>
    )
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>
  }

  return (
    <div>
      <TopBar
        searchValue={searchValue}
        onSearchChange={e => setSearchValue(e.target.value)}
        onSearchKeyDown={handleSearchKeyDown}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />


      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          padding: '0 10px',
          gap: '8px',
          marginTop: '8px',
        }}
      >
        {sortedProducts.length === 0 ? (
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              color: '#999',
              padding: '20px',
              fontSize: '14px',
            }}
          >
            Ничего не найдено
          </div>
        ) : (
          sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}