export interface Product {
	id: string
	name: string
	price: string
	image: string
  images?: string[]
  video?: string
  link?: string
  description?: string
  rating?: number
  reviewsCount?: number
  lastFeedbackText?: string
  lastFeedbackRecentRating?: number
	category?: string
	tags?: string[]
}

const products: Product[] = [
	{
		id: 'iphone-12-green',
		name: 'iPhone 12 Green',
		price: '124 000 ₽',
		image: '/products/iphone-12-green.png',
		category: 'smartphones',
	},
	{
		id: 'iphone-16-ultramarine',
		name: 'iPhone 16 Ultra',
		price: '150 000 ₽',
		image: '/products/iphone-12-green.png',
		category: 'smartphones',
	},
	{
		id: 'airpods-pro',
		name: 'AirPods Pro',
		price: '25 000 ₽',
		image: '/products/iphone-12-green.png',
		category: 'headphones',
	},
	{
		id: 'apple-watch',
		name: 'Apple Watch Series 9',
		price: '55 000 ₽',
		image: '/products/iphone-12-green.png',
		category: 'smartwatches',
	},
	{
		id: 'ipad-air',
		name: 'iPad Air',
		price: '65 000 ₽',
		image: '/products/iphone-12-green.png',
		category: 'tablets',
	},
]

// Экспортируем как объект для быстрого доступа по id
export const productMap = products.reduce((acc, product) => {
	acc[product.id] = product
	return acc
}, {} as Record<string, Product>)

// Глобальное хранилище для товаров с бэкенда
export const backendProductsMap = new Map<string, Product>()

// Функция для добавления товара с бэкенда в глобальное хранилище
export function addBackendProduct(product: Product) {
	backendProductsMap.set(product.id, product)
}

// Функция для получения товара по id (сначала из локальных, потом из бэкенда)
export function getProductById(id: string): Product | undefined {
	// Сначала ищем в локальных товарах
	if (productMap[id]) {
		return productMap[id]
	}
	// Затем ищем в товарах с бэкенда
	return backendProductsMap.get(id)
}

// Экспортируем как массив — для отображения в каталоге
export { products }
