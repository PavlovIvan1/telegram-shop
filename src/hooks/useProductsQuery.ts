import { useQuery } from '@tanstack/react-query'
import { API_URL } from '../constants/url.constants'
import type { Product } from '../data/products'
import { addBackendProduct } from '../data/products'

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

interface HandleResponse {
	status: string
	items: any[]
	keyword: string
	result?: string
}

interface RenderResponse {
	left_products: ApiProduct[]
	right_products: ApiProduct[]
}

// Функция для форматирования цены
function formatPrice(priceNumber: number): string {
	return (
		priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
	)
}

// Функция для преобразования API продукта в Product
function transformApiProduct(item: ApiProduct): Product {
	const raw = item.link_to_photos || item.link_to_photo || ''
	const list = raw.split(';').map(s => s.trim()).filter(Boolean)
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
}

// Функция для загрузки продуктов
async function fetchProducts(searchText: string): Promise<Product[]> {
	console.log('fetchProducts вызван с поиском:', searchText)
	
	// Первый запрос - /handle
	const handleRes = await fetch(`${API_URL}/handle`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query_id: window.Telegram?.WebApp?.initDataUnsafe?.query_id,
			user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
			search_text: searchText || 'айфон',
		}),
	})

	const handleData: HandleResponse = await handleRes.json()
	if (handleData.status !== 'ok') {
		throw new Error(handleData.result || 'Ошибка при запросе /handle')
	}

	// Второй запрос - /render
	const renderRes = await fetch(`${API_URL}/render`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			items: handleData.items,
			keyword: handleData.keyword,
		}),
	})

	const renderData: RenderResponse = await renderRes.json()
	console.log('Полученные данные renderData:', renderData)

	// Объединяем left_products и right_products в один массив
	const leftProducts: ApiProduct[] = renderData.left_products || []
	const rightProducts: ApiProduct[] = renderData.right_products || []
	const combinedProducts: ApiProduct[] = [...leftProducts, ...rightProducts]

	// Преобразуем API продукты в Product
	const productsArray: Product[] = combinedProducts.map(transformApiProduct)

	// Добавляем товары с бэкенда в глобальное хранилище
	productsArray.forEach(product => {
		addBackendProduct(product)
	})

	productsArray.forEach((product, index) => {
		console.log(`Товар ${index + 1}: ${product.name} — ${product.price}`)
	})

	return productsArray
}

// Хук для загрузки продуктов с кэшированием
export function useProductsQuery(searchText: string) {
	return useQuery({
		queryKey: ['products', searchText],
		queryFn: () => fetchProducts(searchText),
		enabled: !!searchText, // Запрос выполняется только если есть searchText
		staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут
		gcTime: 10 * 60 * 1000, // Кэш хранится 10 минут
		refetchOnWindowFocus: false, // Не перезагружаем при фокусе окна
		refetchOnMount: false, // Не перезагружаем при монтировании
		retry: 1, // Только одна попытка повтора
		retryDelay: 1000, // Задержка 1 секунда
	})
}

// Хук для получения одного продукта по ID
export function useProductQuery(id: string) {
	return useQuery({
		queryKey: ['product', id],
		queryFn: async () => {
			// Сначала ищем в локальном кэше
			const cachedProducts = await fetchProducts('айфон') // Загружаем все продукты
			const product = cachedProducts.find(p => p.id === id)
			if (!product) {
				throw new Error('Продукт не найден')
			}
			return product
		},
		enabled: !!id,
		staleTime: 10 * 60 * 1000, // Продукт считается свежим 10 минут
		gcTime: 30 * 60 * 1000, // Кэш хранится 30 минут
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
		retryDelay: 1000,
	})
}
