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

// import { useEffect, useState } from 'react'
// import { productMap } from '../data/products'
// import styles from './Favorites.module.css'

// import type { Product } from '../data/products'

// export function Favorites() {
// 	const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])

// 	// Функция для загрузки избранных из localStorage
// 	const loadFavorites = () => {
// 		const favorites = JSON.parse(
// 			localStorage.getItem('favorites') || '[]'
// 		) as string[]
// 		const items = favorites
// 			.map(id => productMap[id])
// 			.filter((p): p is Product => p !== undefined)
// 		setFavoriteProducts(items)
// 	}

// 	useEffect(() => {
// 		loadFavorites()

// 		// Обновлять при изменении localStorage в других вкладках
// 		function onStorageChange(event: StorageEvent) {
// 			if (event.key === 'favorites') {
// 				loadFavorites()
// 			}
// 		}

// 		window.addEventListener('storage', onStorageChange)

// 		return () => window.removeEventListener('storage', onStorageChange)
// 	}, [])

// 	// Еще можно добавить кнопку "Обновить", если storage-событие не срабатывает в рамках одного таба

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
// pages/Favorites.tsx
import { Heart } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { FavoriteButton } from '../components/ui/FavoriteButton/FavoriteButton'
import heartStyles from '../components/ui/FavoriteButton/FavoriteButton.module.css'
import type { Product } from '../data/products'
import { getProductById } from '../data/products'
import { getFavorites, removeFavorite } from '../utils/favoritesStorage'
import styles from './Favorites.module.css'
import { BRAND_COLOR } from '../constants/colors'

export function Favorites() {
	const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const removeFromFavorites = async (productId: string) => {
    await removeFavorite(String(productId))
    loadFavorites()
  }

  const loadFavorites = useCallback(() => {
    ;(async () => {
      try {
        setLoading(true)
        const favorites = await getFavorites()
        const items = favorites
          .map(id => getProductById(String(id)) ?? null)
          .filter((p): p is Product => p !== null)
        setFavoriteProducts(items)
      } catch (err) {
        console.error('[Favorites] error reading favorites', err)
        setFavoriteProducts([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

	useEffect(() => {
		loadFavorites()

		const onStorage = (ev: StorageEvent) => {
			if (ev.key === 'favorites') {
				console.log('[Favorites] storage event fired (cross-tab), updating')
				loadFavorites()
			}
		}
		const onCustom = () => {
			console.log('[Favorites] custom event favoritesUpdated fired, updating')
			loadFavorites()
		}

		window.addEventListener('storage', onStorage)
		window.addEventListener('favoritesUpdated', onCustom)

		return () => {
			window.removeEventListener('storage', onStorage)
			window.removeEventListener('favoritesUpdated', onCustom)
		}
	}, [loadFavorites])

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <BeatLoader color={BRAND_COLOR} size={10} />
      </div>
    )
  }

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
						<div style={{ position: 'relative' }}>
							<img
								src={product.image}
								alt={product.name}
								onError={e => {
									;(e.currentTarget as HTMLImageElement).style.display = 'none'
								}}
								style={{
									width: '100%',
									objectFit: 'cover',
									borderRadius: 12,
								}}
							/>
							<div style={{ position: 'absolute', top: '8px', right: '8px' }}>
								<FavoriteButton
									w='32px'
									h='32px'
									bgColor='#ff3b30'
									onClick={() => removeFromFavorites(product.id)}
									style={{
										borderRadius: '50%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										color: '#fff',
									}}
								>
									<span className={heartStyles.heartIcon}>
										<Heart
											size={14}
											fill='currentColor'
											stroke='white'
											strokeWidth='2'
										/>
									</span>
								</FavoriteButton>
							</div>
						</div>
						<h3 style={{ margin: '8px 0 4px', fontSize: '15px' }}>
							{product.name}
						</h3>
						<span style={{ color: '#ae1ae8', fontWeight: 500 }}>
							{product.price}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
