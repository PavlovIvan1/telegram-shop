// import { useState } from 'react'
// import { products } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// export function Products() {
// 	const [searchValue, setSearchValue] = useState('')
// 	const [sortOption, setSortOption] = useState('name-asc')
// 	const [filterCategory, setFilterCategory] = useState('')

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

// 	// Сортировка
// 	const sortedProducts = [...filteredProducts].sort((a, b) => {
// 		switch (sortOption) {
// 			case 'name-asc':
// 				return a.name.localeCompare(b.name)
// 			case 'name-desc':
// 				return b.name.localeCompare(a.name)
// 			case 'price-asc':
// 				return parseInt(a.price) - parseInt(b.price)
// 			case 'price-desc':
// 				return parseInt(b.price) - parseInt(a.price)
// 			default:
// 				return 0
// 		}
// 	})

// 	return (
// 		<div>
// <TopBar
// 	searchValue={searchValue}
// 	onSearchChange={e => setSearchValue(e.target.value)}
// 	sortOption={sortOption}
// 	onSortChange={setSortOption}
// 	filterCategory={filterCategory}
// 	onFilterChange={setFilterCategory}
// />

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

// import { useEffect, useState } from 'react'
// import { API_URL } from '../../../constants/url.constants'
// import type { Product } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// export function Products() {
// 	const [searchValue, setSearchValue] = useState('')
// 	const [sortOption, setSortOption] = useState('name-asc')
// 	const [filterCategory, setFilterCategory] = useState('')
// 	const [products, setProducts] = useState<Product[]>([])
// 	const [loading, setLoading] = useState(true)
// 	const [error, setError] = useState<string | null>(null)

// 	useEffect(() => {
// 		const fetchProducts = async () => {
// 			try {
// 				setLoading(true)

// 				// 1️⃣ Запрос /handle
// 				const handleRes = await fetch(`${API_URL}/handle`, {
// 					method: 'POST',
// 					headers: { 'Content-Type': 'application/json' },
// 					body: JSON.stringify({
// 						query_id: window.Telegram?.WebApp?.initDataUnsafe?.query_id,
// 						user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
// 						search_text: searchValue || 'айфон', // можно привязать к поиску
// 					}),
// 				})

// 				const handleData = await handleRes.json()
// 				if (handleData.status !== 'ok') {
// 					throw new Error(handleData.result || 'Ошибка при запросе /handle')
// 				}

// 				// 2️⃣ Запрос /render
// 				const renderRes = await fetch(`${API_URL}/render`, {
// 					method: 'POST',
// 					headers: { 'Content-Type': 'application/json' },
// 					body: JSON.stringify({
// 						items: handleData.items,
// 						keyword: handleData.keyword,
// 					}),
// 				})

// 				const renderData = await renderRes.json()

// 				// 3️⃣ Заполняем товары
// 				const productsArray: Product[] = Object.values(
// 					renderData?.products || {}
// 				)
// 				setProducts(productsArray)
// 			} catch (err) {
// 				setError((err as Error).message)
// 			} finally {
// 				setLoading(false)
// 			}
// 		}

// 		fetchProducts()
// 	}, [searchValue]) // перезапрос при изменении поиска

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

// 	// Сортировка
// 	const sortedProducts = [...filteredProducts].sort((a, b) => {
// 		switch (sortOption) {
// 			case 'name-asc':
// 				return a.name.localeCompare(b.name)
// 			case 'name-desc':
// 				return b.name.localeCompare(a.name)
// 			case 'price-asc':
// 				return parseInt(a.price) - parseInt(b.price)
// 			case 'price-desc':
// 				return parseInt(b.price) - parseInt(a.price)
// 			default:
// 				return 0
// 		}
// 	})

// 	if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>
// 	if (error)
// 		return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>

// 	return (
// 		<div>
// 			<TopBar
// 				searchValue={searchValue}
// 				onSearchChange={e => setSearchValue(e.target.value)}
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

// import { useState } from 'react'
// import { API_URL } from '../../../constants/url.constants'
// import type { Product } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// export function Products() {
// 	const [searchValue, setSearchValue] = useState('')
// 	const [sortOption, setSortOption] = useState('name-asc')
// 	const [filterCategory, setFilterCategory] = useState('')
// 	const [products, setProducts] = useState<Product[]>([])
// 	const [loading, setLoading] = useState(false)
// 	const [error, setError] = useState<string | null>(null)

// 	const fetchProducts = async (searchText: string) => {
// 		try {
// 			setLoading(true)
// 			setError(null)

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

// 			const renderRes = await fetch(`${API_URL}/render`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					items: handleData.items,
// 					keyword: handleData.keyword,
// 				}),
// 			})

// 			const renderData = await renderRes.json()
// 			const productsArray: Product[] = Object.values(renderData?.products || {})
// 			setProducts(productsArray)
// 		} catch (err) {
// 			setError((err as Error).message)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (e.key === 'Enter') {
// 			fetchProducts(searchValue)
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

// 	// Сортировка
// 	const sortedProducts = [...filteredProducts].sort((a, b) => {
// 		switch (sortOption) {
// 			case 'name-asc':
// 				return a.name.localeCompare(b.name)
// 			case 'name-desc':
// 				return b.name.localeCompare(a.name)
// 			case 'price-asc':
// 				return parseInt(a.price) - parseInt(b.price)
// 			case 'price-desc':
// 				return parseInt(b.price) - parseInt(a.price)
// 			default:
// 				return 0
// 		}
// 	})

// 	if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>
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

// ------------------------

// import { useState } from 'react'
// import { API_URL } from '../../../constants/url.constants'
// import type { Product } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// export function Products() {
// 	const [searchValue, setSearchValue] = useState('')
// 	const [sortOption, setSortOption] = useState('name-asc')
// 	const [products, setProducts] = useState<Product[]>([])
// 	const [loading, setLoading] = useState(false)
// 	const [error, setError] = useState<string | null>(null)

// 	const fetchProducts = async (searchText: string) => {
// 		try {
// 			setLoading(true)
// 			setError(null)

// 			// 1️⃣ handle
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

// 			// 2️⃣ render
// 			const renderRes = await fetch(`${API_URL}/render`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					items: handleData.items,
// 					keyword: handleData.keyword,
// 				}),
// 			})

// 			const renderData = await renderRes.json()

// 			// 3️⃣ Преобразуем товары под нужный формат
// 			const productsArray: Product[] = Object.values(renderData || {}).map(
// 				(item: any) => ({
// 					id: item.nm_id,
// 					name: item.name,
// 					price: item.price, // число
// 					link: item.link,
// 					rating: item.nmReviewRating,
// 					feedbacks: item.nmFeedbacks,
// 					lastFeedbackText: item.text_of_last_feedback,
// 					lastFeedbackRate: item.rate_of_last_feedback,
// 					imageCount: item.number_of_images,
// 					photoLinks: item.link_to_photos?.split(';').filter(Boolean) || [],
// 					videoLink: item.link_to_video || null,
// 					category: null, // поле есть, но всегда пустое
// 					tags: [], // теги пустые
// 				})
// 			)

// 			setProducts(productsArray)
// 		} catch (err) {
// 			setError((err as Error).message)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (e.key === 'Enter') {
// 			fetchProducts(searchValue)
// 		}
// 	}

// 	// Фильтрация
// 	const filteredProducts = products.filter(product => {
// 		const search = searchValue.toLowerCase().trim()
// 		if (!search) return true

// 		return (
// 			product.name.toLowerCase().includes(search) ||
// 			product.price.toString().includes(search)
// 		)
// 	})

// 	// Сортировка
// 	const sortedProducts = [...filteredProducts].sort((a, b) => {
// 		switch (sortOption) {
// 			case 'name-asc':
// 				return a.name.localeCompare(b.name)
// 			case 'name-desc':
// 				return b.name.localeCompare(a.name)
// 			case 'price-asc':
// 				return a.price - b.price
// 			case 'price-desc':
// 				return b.price - a.price
// 			default:
// 				return 0
// 		}
// 	})

// 	if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>
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

// import { useState } from 'react'
// import { API_URL } from '../../../constants/url.constants'
// import type { Product } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// // interface ApiProduct {
// // 	nm_id: number
// // 	name: string
// // 	price: number
// // 	link_to_photos?: string
// // }

// export function Products() {
// 	const [searchValue, setSearchValue] = useState('')
// 	const [sortOption, setSortOption] = useState('name-asc')
// 	const [filterCategory, setFilterCategory] = useState('')
// 	const [products, setProducts] = useState<Product[]>([])
// 	const [loading, setLoading] = useState(false)
// 	const [error, setError] = useState<string | null>(null)

// 	const fetchProducts = async (searchText: string) => {
// 		try {
// 			setLoading(true)
// 			setError(null)

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

// 			const renderRes = await fetch(`${API_URL}/render`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					items: handleData.items,
// 					keyword: handleData.keyword,
// 				}),
// 			})

// 			const renderData = await renderRes.json()

// 			function formatPrice(priceNumber: number): string {
// 				return (
// 					priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
// 				)
// 			}

// 			const productsArray: Product[] = Object.values(
// 				renderData?.products || {}
// 			).map((item: any) => ({
// 				id: item.nm_id.toString(),
// 				name: item.name,
// 				price: formatPrice(item.price),
// 				image: item.link_to_photos?.split(';').filter(Boolean)[0] || '',
// 				category: '',
// 				tags: [],
// 			}))

// 			// const productsArray: Product[] = Object.values(
// 			// 	renderData?.products || {}
// 			// ).map((item: ApiProduct) => ({
// 			// 	id: item.nm_id.toString(),
// 			// 	name: item.name,
// 			// 	price: formatPrice(item.price),
// 			// 	image: item.link_to_photos?.split(';').filter(Boolean)[0] || '',
// 			// 	category: '',
// 			// 	tags: [],
// 			// }))

// 			setProducts(productsArray)
// 		} catch (err) {
// 			setError((err as Error).message)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (e.key === 'Enter') {
// 			fetchProducts(searchValue)
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

// 	if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>
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

// import { useState } from 'react'
// import { API_URL } from '../../../constants/url.constants'
// import type { Product } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// interface ApiProduct {
// 	nm_id: number
// 	name: string
// 	price: number
// 	link_to_photos?: string
// }

// export function Products() {
// 	const [searchValue, setSearchValue] = useState('')
// 	const [sortOption, setSortOption] = useState('name-asc')
// 	const [filterCategory, setFilterCategory] = useState('')
// 	const [products, setProducts] = useState<Product[]>([])
// 	const [loading, setLoading] = useState(false)
// 	const [error, setError] = useState<string | null>(null)

// 	const fetchProducts = async (searchText: string) => {
// 		try {
// 			setLoading(true)
// 			setError(null)

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

// 			const renderRes = await fetch(`${API_URL}/render`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					items: handleData.items,
// 					keyword: handleData.keyword,
// 				}),
// 			})

// 			const renderData = await renderRes.json()

// 			function formatPrice(priceNumber: number): string {
// 				return (
// 					priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
// 				)
// 			}

// 			// Явно указали тип для значений объекта
// 			const apiProducts: ApiProduct[] = Object.values(
// 				renderData?.products || {}
// 			)

// 			const productsArray: Product[] = apiProducts.map(item => ({
// 				id: item.nm_id.toString(),
// 				name: item.name,
// 				price: formatPrice(item.price),
// 				image: item.link_to_photos?.split(';').filter(Boolean)[0] || '',
// 				category: '',
// 				tags: [],
// 			}))

// 			setProducts(productsArray)
// 		} catch (err) {
// 			setError((err as Error).message)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (e.key === 'Enter') {
// 			fetchProducts(searchValue)
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

// 	if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>
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

// import { useState } from 'react'
// import { API_URL } from '../../../constants/url.constants'
// import type { Product } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// interface ApiProduct {
// 	nm_id: number
// 	name: string
// 	price: number
// 	link_to_photos?: string
// }

// export function Products() {
// 	const [searchValue, setSearchValue] = useState('')
// 	const [sortOption, setSortOption] = useState('name-asc')
// 	const [filterCategory, setFilterCategory] = useState('')
// 	const [products, setProducts] = useState<Product[]>([])
// 	const [loading, setLoading] = useState(false)
// 	const [error, setError] = useState<string | null>(null)

// 	const fetchProducts = async (searchText: string) => {
// 		console.log('fetchProducts вызван с поиском:', searchText)
// 		try {
// 			setLoading(true)
// 			setError(null)

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

// 			const renderRes = await fetch(`${API_URL}/render`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					items: handleData.items,
// 					keyword: handleData.keyword,
// 				}),
// 			})

// 			const renderData = await renderRes.json()
// 			console.log('Полученные данные renderData:', renderData)

// 			function formatPrice(priceNumber: number): string {
// 				return (
// 					priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
// 				)
// 			}

// 			// Явно указали тип для значений объекта
// 			const apiProducts: ApiProduct[] = Object.values(
// 				renderData?.products || {}
// 			)

// 			const productsArray: Product[] = apiProducts.map(item => ({
// 				id: item.nm_id.toString(),
// 				name: item.name,
// 				price: formatPrice(item.price),
// 				image: item.link_to_photos?.split(';').filter(Boolean)[0] || '',
// 				category: '',
// 				tags: [],
// 			}))

// 			// Логируем каждый товар: номер, название и цену
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

// 	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (e.key === 'Enter') {
// 			console.log('Нажат Enter, запускаем поиск')
// 			fetchProducts(searchValue)
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

// 	if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>
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

import { useState } from 'react'
import { API_URL } from '../../../constants/url.constants'
import type { Product } from '../../../data/products'
import { ProductCard } from '../../ProductCard/ProductCard'
import { TopBar } from '../TopBar/TopBar'

interface ApiProduct {
	nm_id: number
	name: string
	price: number
	link_to_photos?: string
}

export function Products() {
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

			const renderRes = await fetch(`${API_URL}/render`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: handleData.items,
					keyword: handleData.keyword,
				}),
			})

			const renderData = await renderRes.json()
			console.log('Полученные данные renderData:', renderData)

			function formatPrice(priceNumber: number): string {
				return (
					priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
				)
			}

			// Объединяем left_products и right_products в один массив
			const leftProducts: ApiProduct[] = renderData.left_products || []
			const rightProducts: ApiProduct[] = renderData.right_products || []

			const combinedProducts: ApiProduct[] = [...leftProducts, ...rightProducts]

			const productsArray: Product[] = combinedProducts.map(item => ({
				id: item.nm_id.toString(),
				name: item.name,
				price: formatPrice(item.price),
				image: item.link_to_photos?.split(';').filter(Boolean)[0] || '',
				category: '',
				tags: [],
			}))

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

	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			console.log('Нажат Enter, запускаем поиск')
			fetchProducts(searchValue)
		}
	}

	// Фильтрация
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

	// Функция для парсинга цены из строки в число
	function parsePrice(priceStr: string): number {
		return Number(priceStr.replace(/[^\d]/g, ''))
	}

	// Сортировка
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

	if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>
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
