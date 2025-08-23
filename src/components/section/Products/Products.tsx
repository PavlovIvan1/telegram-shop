import { useCallback, useEffect, useState } from 'react'
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
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null)

  // Форматируем цену
  const formatPrice = (priceNumber: number): string => {
    return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
  }

  // Парсинг товаров
  const parseProducts = (items: Record<string, any>): Product[] => {
    console.log('Парсинг товаров, items:', items)
    
    if (!items || typeof items !== 'object') {
      console.log('Items пустые или не объект')
      return []
    }

    const itemsArray = Object.values(items)
    console.log('Количество товаров для парсинга:', itemsArray.length)

    return itemsArray.map((item: any, index: number) => {
      console.log(`Парсинг товара ${index}:`, item)
      
      const raw = item.link_to_photos || item.link_to_photo || ''
      const list = raw.split(';').map((s: string) => s.trim()).filter(Boolean)
      const first = list[0] || ''

      const product = {
        id: item.nm_id?.toString() || `product-${index}`,
        name: item.name || 'Без названия',
        price: formatPrice(item.price || 0),
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
      
      console.log(`Создан товар:`, product)
      return product
    })
  }

  // Запрос к /init_search (GET)
  const fetchInitSearch = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_URL}/init_search`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
        },
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

  // Запрос к /handle (POST)
  const fetchHandle = async (searchText: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Отправляем поисковый запрос:', searchText)

      const requestBody = {
        query_id: window.Telegram?.WebApp?.initDataUnsafe?.query_id,
        user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
        username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username ?? null,
        search_text: searchText || 'айфон',
      }

      console.log('Тело запроса:', requestBody)

      const handleRes = await fetch(`${API_URL}/handle`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(requestBody),
      })

      if (!handleRes.ok) {
        throw new Error(`HTTP error! status: ${handleRes.status}`)
      }

      const handleData = await handleRes.json()
      console.log('Получены данные из /handle:', handleData)

      if (handleData.status !== 'ok') {
        throw new Error(handleData.result || 'Ошибка при запросе /handle')
      }

      const productsArray = parseProducts(handleData.items || {})
      console.log('Парсинг завершен, товаров:', productsArray.length)

      productsArray.forEach(product => {
        addBackendProduct(product)
      })

      setProducts(productsArray)
    } catch (err) {
      console.error('Ошибка в fetchHandle:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Определяем, какой запрос вызывать
  const fetchProducts = useCallback((searchText: string) => {
    console.log('fetchProducts вызван с текстом:', searchText)
    if (!searchText.trim()) {
      fetchInitSearch()
    } else {
      fetchHandle(searchText)
    }
  }, [])

  // Debounced функция для поиска
  const debouncedSearch = useCallback((searchText: string) => {
    // Очищаем предыдущий таймер
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Устанавливаем новый таймер
    const timer = setTimeout(() => {
      fetchProducts(searchText)
    }, 500) // 500ms задержка

    setDebounceTimer(timer)
  }, [debounceTimer, fetchProducts])

  // При изменении searchParams
  useEffect(() => {
    const q = searchParams.get('q') || ''
    console.log('useEffect searchParams, q:', q)
    setSearchValue(q)
    fetchProducts(q) // Вызываем нужный запрос в зависимости от `q`
  }, [searchParams, fetchProducts])

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed, searchValue:', searchValue)
      // Очищаем таймер при нажатии Enter
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      fetchProducts(searchValue)
      const next = new URLSearchParams(searchParams)
      if (searchValue) next.set('q', searchValue)
      else next.delete('q')
      setSearchParams(next)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    
    // Используем debounced поиск для автоматического поиска
    debouncedSearch(value)
  }

  const parsePrice = (priceStr: string): number => {
    return Number(priceStr.replace(/[^\d]/g, ''))
  }

  const sortedProducts = [...products].sort((a, b) => {
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
        onSearchChange={handleSearchChange}
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