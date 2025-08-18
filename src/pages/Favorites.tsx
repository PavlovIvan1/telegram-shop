// pages/Favorites.tsx
import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { ProductCard } from '../components/ProductCard/ProductCard'
import { BRAND_COLOR } from '../constants/colors'
import type { Product } from '../data/products'
import { getProductById } from '../data/products'
import { getFavorites } from '../utils/favoritesStorage'

export function Favorites() {
	const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)

	const loadFavorites = useCallback(async () => {
		try {
			setLoading(true)
			const favorites = await getFavorites()
			const products = favorites
				.map(id => getProductById(String(id)))
				.filter((p): p is Product => p !== undefined)
			setFavoriteProducts(products)
		} catch (error) {
			console.error('Error loading favorites:', error)
			setFavoriteProducts([])
		} finally {
			setLoading(false)
		}
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
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	)
}
