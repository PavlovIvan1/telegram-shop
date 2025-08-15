// import { useEffect, useState } from 'react'
// import { useSearchParams } from 'react-router-dom'
// import { BeatLoader } from 'react-spinners'
// import { API_URL } from '../../../constants/url.constants'
// import type { Product } from '../../../data/products'
// import { addBackendProduct } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// interface ApiProduct {
// 	nm_id: number
// 	name: string
// 	price: number
// 	link_to_photos?: string
// 	link_to_photo?: string
// 	link_to_video?: string
// 	link?: string
// 	description?: string
// 	nmReviewRating?: number
// 	nmFeedbacks?: number
// 	text_of_last_feedback?: string
// 	rate_of_last_feedback?: number
// }

// export function Products() {
// 	const [searchParams, setSearchParams] = useSearchParams()
// 	const [searchValue, setSearchValue] = useState('')
// 	const [sortOption, setSortOption] = useState('name-asc')
// 	const [filterCategory, setFilterCategory] = useState('')
// 	const [products, setProducts] = useState<Product[]>([])
// 	const [loading, setLoading] = useState(false)
// 	const [error, setError] = useState<string | null>(null)

// 	// Оптимизированная функция загрузки продуктов - только один запрос к /handle
// 	const fetchProducts = async (searchText: string) => {
// 		console.log('fetchProducts вызван с поиском:', searchText)
// 		try {
// 			setLoading(true)
// 			setError(null)

// 			// Один запрос к /handle - получаем все данные сразу
// 			const handleRes = await fetch(`${API_URL}/handle`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					query_id: window.Telegram?.WebApp?.initDataUnsafe?.query_id,
// 					user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
// 					search_text: searchText || 'айфон',
// 				}),
// 			})

// 			const handleData = await handleRes.json()
// 			if (handleData.status !== 'ok') {
// 				throw new Error(handleData.result || 'Ошибка при запросе /handle')
// 			}

// 			console.log('Полученные данные из /handle:', handleData)

// 			// Форматирование цены
// 			function formatPrice(priceNumber: number): string {
// 				return (
// 					priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
// 				)
// 			}

// 			// Преобразуем API продукты в Product
// 			// Теперь все продукты в одном массиве без разделения на left/right
// 			const productsArray: Product[] = (handleData.items || []).map((item: ApiProduct) => {
// 				const raw = item.link_to_photos || item.link_to_photo || ''
// 				const list = raw.split(';').map(s => s.trim()).filter(Boolean)
// 				const first = list[0] || ''
				
// 				return {
// 					id: item.nm_id.toString(),
// 					name: item.name,
// 					price: formatPrice(item.price),
// 					image: first,
// 					images: list.length > 0 ? list : undefined,
// 					video: item.link_to_video || undefined,
// 					link: item.link || undefined,
// 					description: item.description || undefined,
// 					rating: item.nmReviewRating || undefined,
// 					reviewsCount: item.nmFeedbacks || undefined,
// 					lastFeedbackText: item.text_of_last_feedback || undefined,
// 					lastFeedbackRecentRating: item.rate_of_last_feedback || undefined,
// 					category: '',
// 					tags: [],
// 				}
// 			})

// 			// Добавляем товары с бэкенда в глобальное хранилище
// 			productsArray.forEach(product => {
// 				addBackendProduct(product)
// 			})

// 			productsArray.forEach((product, index) => {
// 				console.log(`Товар ${index + 1}: ${product.name} — ${product.price}`)
// 			})

// 			setProducts(productsArray)
// 		} catch (err) {
// 			setError((err as Error).message)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	// Восстанавливаем поиск из URL и загружаем при монтировании
// 	useEffect(() => {
// 		const q = searchParams.get('q') || ''
// 		if (q !== searchValue) setSearchValue(q)
// 		if (q) fetchProducts(q)
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [searchParams])

// 	// Функция поиска
// 	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (e.key === 'Enter') {
// 			console.log('Нажат Enter, запускаем поиск')
// 			fetchProducts(searchValue)
// 			const next = new URLSearchParams(searchParams)
// 			if (searchValue) next.set('q', searchValue)
// 			else next.delete('q')
// 			setSearchParams(next)
// 		}
// 	}

// 	// Фильтрация
// 	const filteredProducts = products
// 		.filter(product => {
// 			const search = searchValue.toLowerCase().trim()
// 			if (!search) return true

// 			return (
// 				product.name.toLowerCase().includes(search) ||
// 				product.price.toLowerCase().includes(search) ||
// 				product.category?.toLowerCase().includes(search) ||
// 				product.tags?.some(tag => tag.toLowerCase().includes(search))
// 			)
// 		})
// 		.filter(product => {
// 			if (!filterCategory) return true
// 			return product.category === filterCategory
// 		})

// 	// Функция для парсинга цены из строки в число
// 	function parsePrice(priceStr: string): number {
// 		return Number(priceStr.replace(/[^\d]/g, ''))
// 	}

// 	// Сортировка
// 	const sortedProducts = [...filteredProducts].sort((a, b) => {
// 		switch (sortOption) {
// 			case 'name-asc':
// 				return a.name.localeCompare(b.name)
// 			case 'name-desc':
// 				return b.name.localeCompare(a.name)
// 			case 'price-asc':
// 				return parsePrice(a.price) - parsePrice(b.price)
// 			case 'price-desc':
// 				return parsePrice(b.price) - parsePrice(a.price)
// 			default:
// 				return 0
// 		}
// 	})

// 	if (loading)
// 		return (
// 			<div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
// 				<BeatLoader color={window.Telegram?.WebApp?.themeParams?.button_color || '#007EE5'} size={10} />
// 			</div>
// 		)
// 	if (error)
// 		return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>

// 	return (
// 		<div>
// 			<TopBar
// 				searchValue={searchValue}
// 				onSearchChange={e => setSearchValue(e.target.value)}
// 				onSearchKeyDown={handleSearchKeyDown}
// 				sortOption={sortOption}
// 				onSortChange={setSortOption}
// 				filterCategory={filterCategory}
// 				onFilterChange={setFilterCategory}
// 			/>

// 			<div
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'space-between',
// 					flexWrap: 'wrap',
// 					padding: '0 10px',
// 					gap: '8px',
// 					marginTop: '8px',
// 				}}
// 			>
// 				{sortedProducts.length === 0 ? (
// 					<div
// 						style={{
// 							width: '100%',
// 							textAlign: 'center',
// 							color: '#999',
// 							padding: '20px',
// 							fontSize: '14px',
// 						}}
// 					>
// 						Ничего не найдено
// 					</div>
// 				) : (
// 					sortedProducts.map(product => (
// 						<ProductCard key={product.id} product={product} />
// 					))
// 				)}
// 			</div>
// 		</div>
// 	)
// }

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { API_URL } from '../../../constants/url.constants'
import type { Product } from '../../../data/products'
import { addBackendProduct } from '../../../data/products'
import { ProductCard } from '../../ProductCard/ProductCard'
import { TopBar } from '../TopBar/TopBar'

interface ApiProduct {
  nm_id: number
  name: string
  price: number
  link_to_photos?: string
  link_to_photo?: string
  link_to_video?: string
  link?: string
  description?: string
  nmReviewRating?: number
  nmFeedbacks?: number
  text_of_last_feedback?: string
  rate_of_last_feedback?: number
}

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const [sortOption, setSortOption] = useState('name-asc')
  const [filterCategory, setFilterCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async (searchText: string) => {
    console.log('fetchProducts вызван с поиском:', searchText)
    try {
      setLoading(true)
      setError(null)

      const handleRes = await fetch(`${API_URL}/handle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_id: window.Telegram?.WebApp?.initDataUnsafe?.query_id,
          user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
          search_text: searchText || 'айфон',
        }),
      })

      const handleData = await handleRes.json()
      if (handleData.status !== 'ok') {
        throw new Error(handleData.result || 'Ошибка при запросе /handle')
      }

      console.log('Полученные данные из /handle:', handleData)

      function formatPrice(priceNumber: number): string {
        return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
      }

      // Преобразуем объект items в массив продуктов
      const itemsObject = handleData.items || {}
      const productsArray: Product[] = Object.values(itemsObject).map((item: any) => {
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

      productsArray.forEach(product => {
        addBackendProduct(product)
      })

      productsArray.forEach((product, index) => {
        console.log(`Товар ${index + 1}: ${product.name} — ${product.price}`)
      })

      setProducts(productsArray)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const q = searchParams.get('q') || ''
    if (q !== searchValue) setSearchValue(q)
    if (q) fetchProducts(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Нажат Enter, запускаем поиск')
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
    .filter(product => {
      if (!filterCategory) return true
      return product.category === filterCategory
    })

  function parsePrice(priceStr: string): number {
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

  if (loading)
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <BeatLoader color={window.Telegram?.WebApp?.themeParams?.button_color || '#007EE5'} size={10} />
      </div>
    )
  if (error)
    return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>

  return (
    <div>
      <TopBar
        searchValue={searchValue}
        onSearchChange={e => setSearchValue(e.target.value)}
        onSearchKeyDown={handleSearchKeyDown}
        sortOption={sortOption}
        onSortChange={setSortOption}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
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