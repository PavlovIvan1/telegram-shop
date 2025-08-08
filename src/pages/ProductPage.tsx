import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Product } from '../data/products'
import { productMap } from '../data/products'
import styles from './ProductPage.module.css'

export function ProductPage() {
	const { id = '' } = useParams()
	const navigate = useNavigate()
	const [product, setProduct] = useState<Product | null>(null)

	console.log('productMap:', productMap)

	useEffect(() => {
		console.log('ID из URL:', id)
		if (id && productMap[id]) {
			setProduct(productMap[id])
		} else {
			console.warn('Товар не найден в productMap:', id)
			setProduct(null)
		}
	}, [id])

	const images = product ? [product.image] : []
	const [sliderRef] = useKeenSlider<HTMLDivElement>({
		loop: true,
		slides: {
			perView: 1,
			spacing: 10,
		},
	})

	// ✅ Теперь можно делать early return
	if (!product) {
		return (
			<div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
				Товар не найден
			</div>
		)
	}

	// Пример отзывов
	const reviews = [
		{
			id: 1,
			author: 'Анна',
			rating: 5,
			text: 'Отличный телефон, камера супер!',
			date: '10 мая 2025',
		},
		{
			id: 2,
			author: 'Дмитрий',
			rating: 4,
			text: 'Хорошее устройство, но цена высоковата.',
			date: '5 мая 2025',
		},
	]

	return (
		<div className={styles.container}>
			{/* Хедер */}
			<header className={styles.header}>
				<button className={styles.backButton} onClick={() => navigate(-1)}>
					<ArrowLeft size={20} />
				</button>
				<h1 className={styles.title}>Товар</h1>
			</header>

			{/* Слайдер */}
			<div className={styles.slider}>
				<div
					ref={sliderRef}
					className='keen-slider'
					style={{ borderRadius: '12px', overflow: 'hidden' }}
				>
					{images.map((src, index) => (
						<div className='keen-slider__slide' key={index}>
							<img
								src={src}
								alt={`Фото ${index + 1}`}
								style={{
									width: '100%',
									objectFit: 'cover',
								}}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Информация о товаре */}
			<div className={styles.info}>
				<h2 className={styles.productName}>{product.name}</h2>
				<div className={styles.price}>{product.price}</div>
				<div className={styles.description}>
					<h3>Описание</h3>
					<p>
						{product.name} — это мощное устройство с отличной камерой, высокой
						производительностью и стильным дизайном. Подходит для повседневного
						использования и профессиональных задач.
					</p>
				</div>
			</div>

			{/* Отзывы */}
			<div className={styles.reviews}>
				<h3>Отзывы ({reviews.length})</h3>
				{reviews.map(review => (
					<div key={review.id} className={styles.review}>
						<div className={styles.reviewHeader}>
							<strong>{review.author}</strong>
							<span>{'⭐'.repeat(review.rating)}</span>
							<small>{review.date}</small>
						</div>
						<p className={styles.reviewText}>{review.text}</p>
					</div>
				))}
			</div>
		</div>
	)
}
