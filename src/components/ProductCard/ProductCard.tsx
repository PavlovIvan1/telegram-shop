// // components/ProductCard/ProductCard.tsx
// import { ArrowBigRight, Heart } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import type { Product } from '../../data/products'
// import { Button } from '../ui/Button/Button'
// import { FavoriteButton } from '../ui/FavoriteButton/FavoriteButton'
// import heartStyles from '../ui/FavoriteButton/FavoriteButton.module.css'
// import styles from './ProductCard.module.css'

// interface ProductCardProps {
// 	product: Product
// }

// export function ProductCard({ product }: ProductCardProps) {
// 	const [isFavorite, setIsFavorite] = useState(false)
// 	// const navigate = useNavigate()

// 	useEffect(() => {
// 		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
// 		setIsFavorite(favorites.includes(product.id))
// 	}, [product.id])

// 	const handleFavoriteClick = () => {
// 		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')

// 		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
// 		const newFavorites = isFavorite
// 			? favorites.filter((id: string) => id !== product.id)
// 			: [...favorites, product.id]

// 		localStorage.setItem('favorites', JSON.stringify(newFavorites))
// 		setIsFavorite(!isFavorite)
// 	}

// 	return (
// 		<div className={styles.card}>
// 			<img src={product.image} alt={product.name} />
// 			<div className={styles.card_info} style={{ marginBottom: '5px' }}>
// 				<h3 style={{ marginBottom: '5px' }}>{product.name}</h3>
// 				<span>{product.price}</span>
// 			</div>
// 			<div className={styles.card_buttons}>
// 				{/* <Button
// 					w='36px'
// 					h='36px'
// 					onClick={() => navigate(`/product/${product.id}`, { state: product })}
// 				>
// 					<ArrowBigRight size={20} />
// 				</Button> */}

// 				<Link to={`/product/${product.id}`} state={{ product }}>
// 					<Button w='36px' h='36px'>
// 						<ArrowBigRight size={20} />
// 					</Button>
// 				</Link>

// 				<FavoriteButton
// 					w='36px'
// 					h='36px'
// 					bgColor={isFavorite ? '#ff3b30' : '#007EE5'}
// 					onClick={handleFavoriteClick}
// 					style={{
// 						borderRadius: '50%',
// 						display: 'flex',
// 						justifyContent: 'center',
// 						alignItems: 'center',
// 						color: '#fff',
// 					}}
// 				>
// 					<span className={heartStyles.heartIcon}>
// 						<Heart
// 							size={16}
// 							fill='currentColor'
// 							stroke={isFavorite ? 'white' : 'none'}
// 							strokeWidth='2'
// 						/>
// 					</span>
// 				</FavoriteButton>
// 			</div>
// 		</div>
// 	)
// }

// components/ProductCard/ProductCard.tsx
import { ArrowBigRight, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { Button } from '../ui/Button/Button'
import { FavoriteButton } from '../ui/FavoriteButton/FavoriteButton'
import heartStyles from '../ui/FavoriteButton/FavoriteButton.module.css'
import styles from './ProductCard.module.css'

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	const [isFavorite, setIsFavorite] = useState(false)

	useEffect(() => {
		try {
			const stored = localStorage.getItem('favorites') || '[]'
			const favorites = JSON.parse(stored) as string[]

			setIsFavorite(favorites.includes(String(product.id)))
		} catch (e) {
			console.error(
				'[ProductCard] error parsing favorites from localStorage',
				e
			)
			setIsFavorite(false)
		}
	}, [product.id])

	const handleFavoriteClick = () => {
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')

		const stored = localStorage.getItem('favorites') || '[]'
		const favorites = JSON.parse(stored) as string[]

		const newFavorites = isFavorite
			? favorites.filter(id => id !== String(product.id))
			: [...favorites, String(product.id)]

		localStorage.setItem('favorites', JSON.stringify(newFavorites))
		setIsFavorite(!isFavorite)
	}

	return (
		<div className={styles.card}>
			<img src={product.image} alt={product.name} />
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
					bgColor={isFavorite ? '#ff3b30' : '#007EE5'}
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
