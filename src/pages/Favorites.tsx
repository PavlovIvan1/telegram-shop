// // pages/Favorites.tsx
// import { useEffect, useState } from 'react'
// import styles from './Favorites.module.css'

// interface Product {
// 	name: string
// 	price: string
// 	image: string
// }

// const products: Record<string, Product> = {
// 	'iphone-12-green': {
// 		name: 'iPhone 12 Green',
// 		price: '124 000 ₽',
// 		image: '/products/iphone-12-green.png',
// 	},
// 	// Можно добавить другие
// }

// export function Favorites() {
// 	const [favoriteProducts, setFavoriteProducts] = useState<any[]>([])

// 	useEffect(() => {
// 		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
// 		const items = favorites
// 			.map((id: string) => ({
// 				id,
// 				...products[id],
// 			}))
// 			.filter((item: any) => item.name) // только существующие

// 		setFavoriteProducts(items)
// 	}, [])

// 	if (favoriteProducts.length === 0) {
// 		return (
// 			<div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
// 				Нет избранных товаров
// 			</div>
// 		)
// 	}

// 	return (
// 		<div style={{ padding: '16px' }}>
// 			<h2>Избранное</h2>
// 			<div
// 				style={{
// 					display: 'grid',
// 					gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
// 					gap: '16px',
// 					marginTop: '12px',
// 				}}
// 			>
// 				{favoriteProducts.map(product => (
// 					<div key={product.id} className={styles.favoriteCard}>
// 						<img
// 							src={product.image}
// 							alt={product.name}
// 							style={{
// 								width: '100%',
// 								height: 140,
// 								objectFit: 'cover',
// 								borderRadius: 12,
// 							}}
// 						/>
// 						<h3 style={{ margin: '8px 0 4px', fontSize: '15px' }}>
// 							{product.name}
// 						</h3>
// 						<span style={{ color: '#007EE5', fontWeight: 500 }}>
// 							{product.price}
// 						</span>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	)
// }

// // pages/Favorites.tsx
// import { useEffect, useState } from 'react'
// import type { Product } from '../data/products'
// import { productMap } from '../data/products'
// import styles from './Favorites.module.css'

// interface ProductWithId extends Product {
// 	id: string
// }

// export function Favorites() {
// 	const [favoriteProducts, setFavoriteProducts] = useState<ProductWithId[]>([])

// 	useEffect(() => {
// 		const favorites = JSON.parse(
// 			localStorage.getItem('favorites') || '[]'
// 		) as string[]

// 		const items = favorites
// 			.map(id => {
// 				const product = productMap[id]
// 				return product ? { id, ...product } : null
// 			})
// 			.filter(Boolean) as ProductWithId[]

// 		setFavoriteProducts(items)
// 	}, [])

// 	if (favoriteProducts.length === 0) {
// 		return (
// 			<div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
// 				Нет избранных товаров
// 			</div>
// 		)
// 	}

// 	return (
// 		<div style={{ padding: '16px' }}>
// 			<h2>Избранное</h2>
// 			<div
// 				style={{
// 					display: 'grid',
// 					gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
// 					gap: '16px',
// 					marginTop: '12px',
// 				}}
// 			>
// 				{favoriteProducts.map(product => (
// 					<div key={product.id} className={styles.favoriteCard}>
// 						<img
// 							src={product.image}
// 							alt={product.name}
// 							style={{
// 								width: '100%',
// 								height: 140,
// 								objectFit: 'cover',
// 								borderRadius: 12,
// 							}}
// 						/>
// 						<h3 style={{ margin: '8px 0 4px', fontSize: '15px' }}>
// 							{product.name}
// 						</h3>
// 						<span style={{ color: '#007EE5', fontWeight: 500 }}>
// 							{product.price}
// 						</span>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	)
// }

// // pages/Favorites.tsx
// import { useEffect, useState } from 'react'
// import { productMap } from '../data/products'
// import styles from './Favorites.module.css'

// import type { Product } from '../data/products'

// export function Favorites() {
// 	const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])

// 	useEffect(() => {
// 		const favorites = JSON.parse(
// 			localStorage.getItem('favorites') || '[]'
// 		) as string[]

// 		const items = favorites
// 			.map(id => {
// 				const product = productMap[id]
// 				return product ? product : null // ✅ возвращаем сам продукт
// 			})
// 			.filter((product): product is Product => product !== null) // type guard

// 		setFavoriteProducts(items)
// 	}, [])

// 	if (favoriteProducts.length === 0) {
// 		return (
// 			<div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
// 				Нет избранных товаров
// 			</div>
// 		)
// 	}

// 	return (
// 		<div style={{ padding: '16px' }}>
// 			<h2>Избранное</h2>
// 			<div
// 				style={{
// 					display: 'grid',
// 					gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
// 					gap: '16px',
// 					marginTop: '12px',
// 				}}
// 			>
// 				{favoriteProducts.map(product => (
// 					<div key={product.id} className={styles.favoriteCard}>
// 						<img
// 							src={product.image}
// 							alt={product.name}
// 							style={{
// 								width: '100%',
// 								// height: 140,
// 								objectFit: 'cover',
// 								borderRadius: 12,
// 							}}
// 						/>
// 						<h3 style={{ margin: '8px 0 4px', fontSize: '15px' }}>
// 							{product.name}
// 						</h3>
// 						<span style={{ color: '#007EE5', fontWeight: 500 }}>
// 							{product.price}
// 						</span>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	)
// }

import { useEffect, useState } from 'react'
import { productMap } from '../data/products'
import styles from './Favorites.module.css'

import type { Product } from '../data/products'

export function Favorites() {
	const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])

	// Функция для загрузки избранных из localStorage
	const loadFavorites = () => {
		const favorites = JSON.parse(
			localStorage.getItem('favorites') || '[]'
		) as string[]
		const items = favorites
			.map(id => productMap[id])
			.filter((p): p is Product => p !== undefined)
		setFavoriteProducts(items)
	}

	useEffect(() => {
		loadFavorites()

		// Обновлять при изменении localStorage в других вкладках
		function onStorageChange(event: StorageEvent) {
			if (event.key === 'favorites') {
				loadFavorites()
			}
		}

		window.addEventListener('storage', onStorageChange)

		return () => window.removeEventListener('storage', onStorageChange)
	}, [])

	// Еще можно добавить кнопку "Обновить", если storage-событие не срабатывает в рамках одного таба

	if (favoriteProducts.length === 0) {
		return (
			<div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
				Нет избранных товаров
			</div>
		)
	}

	return (
		<div style={{ padding: '16px' }}>
			<h2>Избранное</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
					gap: '16px',
					marginTop: '12px',
				}}
			>
				{favoriteProducts.map(product => (
					<div key={product.id} className={styles.favoriteCard}>
						<img
							src={product.image}
							alt={product.name}
							style={{
								width: '100%',
								objectFit: 'cover',
								borderRadius: 12,
							}}
						/>
						<h3 style={{ margin: '8px 0 4px', fontSize: '15px' }}>
							{product.name}
						</h3>
						<span style={{ color: '#007EE5', fontWeight: 500 }}>
							{product.price}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
