// components/ProductCard/ProductCard.tsx
import { ArrowBigRight, Heart } from 'lucide-react'
import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { getFavorites, toggleFavorite } from '../../utils/favoritesStorage'
import { Button } from '../ui/Button/Button'
import { FavoriteButton } from '../ui/FavoriteButton/FavoriteButton'
import { OptimizedImage } from '../ui/OptimizedImage'
import heartStyles from '../ui/FavoriteButton/FavoriteButton.module.css'
import styles from './ProductCard.module.css'

interface ProductCardProps {
	product: Product
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
	const [isFavorite, setIsFavorite] = useState(false)

	// Мемоизируем функцию загрузки избранного
	const loadFavorites = useCallback(async () => {
		const favorites = await getFavorites()
		setIsFavorite(favorites.includes(String(product.id)))
	}, [product.id])

	useEffect(() => {
		let mounted = true
		;(async () => {
			if (mounted) {
				await loadFavorites()
			}
		})()
		return () => {
			mounted = false
		}
	}, [loadFavorites])

	// Мемоизируем функцию клика по избранному
	const handleFavoriteClick = useCallback(async () => {
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
		await toggleFavorite(String(product.id))
		await loadFavorites()
	}, [product.id, loadFavorites])

	// Мемоизируем стили для изображения
	const imageStyles = useMemo(() => ({
		width: '100%',
		height: 'auto',
		borderRadius: '8px',
	}), [])

	// Мемоизируем стили для кнопок
	const buttonsStyles = useMemo(() => ({
		borderRadius: '50%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: '#fff',
	}), [])

	return (
		<div className={styles.card}>
			<OptimizedImage 
				src={product.image} 
				alt={product.name} 
				style={imageStyles}
				lazy={true}
				preload={false}
			/>
			<div className={styles.card_info} style={{ marginBottom: '5px' }}>
				<h3 style={{ marginBottom: '5px' }}>{product.name}</h3>
				<span>{product.price}</span>
			</div>
			<div className={styles.card_buttons}>
				<Link to={`/product/${product.id}`} state={{ product }}>
					<Button w='36px' h='36px'>
						<ArrowBigRight size={20} />
					</Button>
				</Link>

				<FavoriteButton
					w='36px'
					h='36px'
					bgColor={isFavorite ? '#ff3b30' : undefined}
					onClick={handleFavoriteClick}
					style={buttonsStyles}
				>
					<span className={heartStyles.heartIcon}>
						<Heart
							size={16}
							fill='currentColor'
							stroke={isFavorite ? 'white' : 'none'}
							strokeWidth='2'
						/>
					</span>
				</FavoriteButton>
			</div>
		</div>
	)
})
