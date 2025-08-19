// components/ProductCard/ProductCard.tsx
import { Heart, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { getFavorites, toggleFavorite } from '../../utils/favoritesStorage'
import { Button } from '../ui/Button/Button'
import { FavoriteButton } from '../ui/FavoriteButton/FavoriteButton'
import heartStyles from '../ui/FavoriteButton/FavoriteButton.module.css'
import { LazyImage } from '../ui/LazyImage'
import styles from './ProductCard.module.css'

interface ProductCardProps {
	product: Product
}

function Rating({ rating }: { rating?: number }) {
	if (rating == null) 	return (
		<div className={styles.card_rating}>
			<span className={styles.card_rating_value}>Без рейтинга</span>
		</div>
	)
	const display = Number.isInteger(rating) ? String(rating) : rating.toFixed(1)
	return (
		<div className={styles.card_rating}>
			<Star size={16} stroke="none" fill="#FF8533" className={styles.card_rating_star} />
			<span className={styles.card_rating_value}>{display}</span>
		</div>
	)
}

export function ProductCard({ product }: ProductCardProps) {
	const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const favorites = await getFavorites()
      if (mounted) setIsFavorite(favorites.includes(String(product.id)))
    })()
    return () => {
      mounted = false
    }
  }, [product.id])

  const handleFavoriteClick = async () => {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
    await toggleFavorite(String(product.id))
    const favorites = await getFavorites()
    setIsFavorite(favorites.includes(String(product.id)))
  }

	return (
		<div className={styles.card}>
			<div style={{ position: 'relative' }}>
				<LazyImage 
					src={product.image} 
					alt={product.name}
					className={styles.cardImage}
					style={{
						width: '100%',
						height: 'auto',
						borderRadius: '8px',
					}}
				/>
				<div style={{ position: 'absolute', top: '8px', right: '8px' }}>
					<FavoriteButton
						w='42px'
						h='42px'
						onClick={handleFavoriteClick}
						style={{
							borderRadius: '50%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<span className={heartStyles.heartIcon}>
							<Heart
								size={20}
								fill={isFavorite ? '#ae1ae8' : 'none'}
								stroke={'#ae1ae8'}
								strokeWidth='2'
							/>
						</span>
					</FavoriteButton>
				</div>
			</div>
			<span className={styles.card_price}>{product.price}</span>
			<div className={styles.card_info}>
				<h3>{product.name}</h3>
				<Rating rating={product.rating} />
			</div>
			<div className={styles.card_button}>
				<Link to={`/product/${product.id}`} state={{ product }}>
					<Button w='100%' h='36px'>
						Посмотреть
					</Button>
				</Link>
			</div>
		</div>
	)
}
