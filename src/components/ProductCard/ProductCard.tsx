// components/ProductCard/ProductCard.tsx
import { ArrowBigRight, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { getFavorites, toggleFavorite } from '../../utils/favoritesStorage'
import { Button } from '../ui/Button/Button'
import { BRAND_COLOR } from '../../constants/colors'
import { FavoriteButton } from '../ui/FavoriteButton/FavoriteButton'
import { LazyImage } from '../ui/LazyImage'
import heartStyles from '../ui/FavoriteButton/FavoriteButton.module.css'
import styles from './ProductCard.module.css'

interface ProductCardProps {
	product: Product
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
			<div className={styles.card_info} style={{ marginBottom: '5px' }}>
				<h3 style={{ marginBottom: '5px' }}>{product.name}</h3>
				<span>{product.price}</span>
			</div>
			<div className={styles.card_buttons}>
				<Link to={`/product/${product.id}`} state={{ product }}>
					<Button w='36px' h='36px'>
						<ArrowBigRight size={20} color={'#ffffff'} />
					</Button>
				</Link>

				<FavoriteButton
					w='36px'
					h='36px'
					bgColor={isFavorite ? '#ff3b30' : undefined}
					onClick={handleFavoriteClick}
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
}
