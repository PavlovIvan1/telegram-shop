import { ArrowBigRight } from 'lucide-react'
import { Button } from '../ui/Button/Button'
import styles from './ProductCard.module.css'

export function ProductCard() {
	return (
		<>
			<div className={styles.card}>
				<img src='/products/iphone-12-green.png' alt='' />
				<div className={styles.card_info}>
					<h3>Iphone 12</h3>
					<span style={{ marginTop: '5px', marginBottom: '5px' }}>
						124 000 р.
					</span>
				</div>
				<Button>
					<ArrowBigRight />
				</Button>
			</div>
		</>
	)
}
