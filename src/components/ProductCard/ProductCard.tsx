// import { ArrowBigRight, Heart } from 'lucide-react'
// import { Button } from '../ui/Button/Button'
// import { FavoriteButton } from '../ui/FavoriteButton/FavoriteButton'
// import heartStyles from '../ui/FavoriteButton/FavoriteButton.module.css'
// import styles from './ProductCard.module.css'

// export function ProductCard() {
// 	const handleFavoriteClick = () => {
// 		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
// 		console.log('Добавлено в избранное')
// 	}

// 	return (
// 		<>
// 			<div className={styles.card}>
// 				<img src='/products/iphone-12-green.png' alt='' />
// 				<div className={styles.card_info} style={{ marginBottom: '5px' }}>
// 					<h3 style={{ marginBottom: '5px' }}>Iphone 12</h3>
// 					<span>124 000 р.</span>
// 				</div>
// 				<div className={styles.card_buttons}>
// 					<Button w='36px' h='36px'>
// 						<ArrowBigRight />
// 					</Button>
// 					<FavoriteButton
// 						w='36px'
// 						h='36px'
// 						bgColor='#ff3b30'
// 						onClick={handleFavoriteClick}
// 						style={{
// 							borderRadius: '50%',
// 							display: 'flex',
// 							justifyContent: 'center',
// 							alignItems: 'center',
// 							color: '#fff',
// 						}}
// 					>
// 						<span className={heartStyles.heartIcon}>
// 							<Heart
// 								size={16}
// 								fill='currentColor'
// 								stroke='white'
// 								strokeWidth='2'
// 							/>
// 						</span>
// 					</FavoriteButton>
// 				</div>
// 			</div>
// 		</>
// 	)
// }

// components/ProductCard/ProductCard.tsx
// import { ArrowBigRight, Heart } from 'lucide-react'
// import { useEffect, useState } from 'react'
// // import { Product, productMap } from '../../data/products'
// import type { Product } from '../../data/products'
// import { productMap } from '../../data/products'
// import { Button } from '../ui/Button/Button'
// import { FavoriteButton } from '../ui/FavoriteButton/FavoriteButton'
// import heartStyles from '../ui/FavoriteButton/FavoriteButton.module.css'
// import styles from './ProductCard.module.css'

// // Укажи ID нужного товара
// const productId = 'iphone-12-green'
// const product: Product = productMap[productId]

// export function ProductCard() {
// 	const [isFavorite, setIsFavorite] = useState(false)

// 	useEffect(() => {
// 		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
// 		setIsFavorite(favorites.includes(productId))
// 	}, [])

// 	const handleFavoriteClick = () => {
// 		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')

// 		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
// 		const newFavorites = isFavorite
// 			? favorites.filter((id: string) => id !== productId)
// 			: [...favorites, productId]

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
// 				<Button w='36px' h='36px'>
// 					<ArrowBigRight size={20} />
// 				</Button>
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
		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		setIsFavorite(favorites.includes(product.id))
	}, [product.id])

	const handleFavoriteClick = () => {
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')

		const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
		const newFavorites = isFavorite
			? favorites.filter((id: string) => id !== product.id)
			: [...favorites, product.id]

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
				<Link to={`/product/${product.id}`}>
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
