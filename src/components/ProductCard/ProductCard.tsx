import { ArrowBigRight, Heart } from 'lucide-react'
import { Button } from '../ui/Button/Button'
import { FavoriteButton } from '../ui/FavoriteButton/FavoriteButton'
import heartStyles from '../ui/FavoriteButton/FavoriteButton.module.css'
import styles from './ProductCard.module.css'

export function ProductCard() {
	const handleFavoriteClick = () => {
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
		console.log('Добавлено в избранное')
	}

	return (
		<>
			<div className={styles.card}>
				<img src='/products/iphone-12-green.png' alt='' />
				<div className={styles.card_info} style={{ marginBottom: '5px' }}>
					<h3 style={{ marginBottom: '5px' }}>Iphone 12</h3>
					<span>124 000 р.</span>
				</div>
				<div className={styles.card_buttons}>
					<Button w='36px' h='36px'>
						<ArrowBigRight />
					</Button>
					<FavoriteButton
						w='36px'
						h='36px'
						bgColor='#ff3b30'
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
								size={16}
								fill='currentColor'
								stroke='white'
								strokeWidth='2'
							/>
						</span>
					</FavoriteButton>
				</div>
			</div>
		</>
	)
}
