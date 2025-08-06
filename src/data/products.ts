export interface Product {
	id: string
	name: string
	price: string
	image: string
	category?: string
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

// Экспортируем как массив — для отображения в каталоге
export { products }
