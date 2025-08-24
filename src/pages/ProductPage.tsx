import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { LazyImage } from '../components/ui/LazyImage'
import { BRAND_COLOR } from '../constants/colors'
import type { Product } from '../data/products'
import { productMap } from '../data/products'
import styles from './ProductPage.module.css'

export function ProductPage() {
	const { id = '' } = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const [product, setProduct] = useState<Product | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const videoRef = useRef<HTMLVideoElement | null>(null)

	useEffect(() => {
		// 1. Сначала пробуем взять товар из location.state
		if (location.state?.product) {
			setProduct(location.state.product)
		}
		// 2. Если нет, ищем в productMap
		else if (id && productMap[id]) {
			setProduct(productMap[id])
		} else {
			setProduct(null)
		}
	}, [id, location.state])

	useEffect(() => {
		// считаем, что продукт загружен когда setProduct отработал
		setIsLoading(false)
	}, [product])

	// Lazy-load HLS only when needed and cleanup on unmount
	useEffect(() => {
		if (product?.video && videoRef.current) {
			try {
				// Для HLS видео
				if (product.video.includes('.m3u8')) {
					// Здесь можно добавить HLS.js если нужно
					videoRef.current.src = product.video
				} else {
					// Обычное видео
					videoRef.current.src = product.video
				}
			} catch (error) {
				console.error('Error loading video:', error)
			}
		}

		return () => {
			if (videoRef.current) {
				videoRef.current.src = ''
			}
		}
	}, [product])

	if (isLoading) {
		return (
			<div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
				<BeatLoader color={BRAND_COLOR} size={10} />
			</div>
		)
	}

	if (!product) {
		return (
			<div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
				Товар не найден
			</div>
		)
	}

	const images = product ? (product.images && product.images.length > 0 ? product.images : [product.image].filter(Boolean)) : []

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<button className={styles.backButton} onClick={() => navigate(-1)}>
					<ArrowLeft size={20} />
				</button>
				<h1 className={styles.title}>Товар</h1>
			</header>

			<div className={styles.slider}>
				<div style={{
					display: 'flex',
					overflowX: 'auto',
					gap: '8px',
					scrollSnapType: 'x mandatory',
					borderRadius: '12px'
				}}>
					{product.video && (
						<div style={{ 
							minWidth: '100%', 
							scrollSnapAlign: 'start',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							aspectRatio: '16/9'
						}}>
							<video
								ref={videoRef}
								style={{ 
									width: '100%', 
									height: '100%', 
									objectFit: 'contain', 
									borderRadius: 12 
								}}
								controls
								preload="none"
								playsInline
								// src устанавливается динамически (для HLS) в useEffect
							/>
						</div>
					)}
					{images.map((src, index) => (
						<div key={index} style={{ 
							minWidth: '100%', 
							scrollSnapAlign: 'start'
						}}>
							<LazyImage
								src={src}
								alt={`Фото ${index + 1}`}
								style={{ 
									width: '100%', 
									height: 'auto', 
									objectFit: 'contain', 
									borderRadius: '12px' 
								}}
							/>
						</div>
					))}
				</div>
			</div>

			<div className={styles.info}>
				<h2 className={styles.productName}>{product.name}</h2>
				<div className={styles.price}>{product.price}</div>
				
				{/* Позиции и остатки */}
				<div style={{ margin: '12px 0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
					{product.organicPosition && (
						<div style={{ 
							padding: '4px 8px', 
							background: '#f0f0f0', 
							borderRadius: '6px', 
							fontSize: '12px',
							color: '#666'
						}}>
							Органическая позиция: {product.organicPosition}
						</div>
					)}
					{product.promoPosition && (
						<div style={{ 
							padding: '4px 8px', 
							background: '#fff3cd', 
							borderRadius: '6px', 
							fontSize: '12px',
							color: '#856404'
						}}>
							Промо позиция: {product.promoPosition}
						</div>
					)}
					{product.remains && (
						<div style={{ 
							padding: '4px 8px', 
							background: '#d4edda', 
							borderRadius: '6px', 
							fontSize: '12px',
							color: '#155724'
						}}>
							Остаток: {product.remains} шт
						</div>
					)}
				</div>

				{product.link && (
					<div style={{ margin: '8px 0 16px' }}>
						<a
							href={product.link}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: 'inline-block',
								padding: '10px 14px',
								borderRadius: 12,
								textDecoration: 'none',
								background: BRAND_COLOR,
								color: '#ffffff',
								fontWeight: 600,
								fontSize: 14,
							}}
						>
							Посмотреть на Wildberries
						</a>
					</div>
				)}
				{product.description && (
					<div className={styles.description}>
						<h3>Описание</h3>
						<p>{product.description}</p>
					</div>
				)}
			</div>

			<div className={styles.reviews}>
				<h3>Отзывы {product.reviewsCount ? `(${product.reviewsCount})` : ''}</h3>
				
				{/* Рейтинг товара */}
				{product.rating && (
					<div style={{ marginBottom: '16px' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
							<span style={{ fontSize: '16px', fontWeight: '600' }}>Общий рейтинг:</span>
							<span style={{ fontSize: '18px' }}>{'⭐'.repeat(Math.round(product.rating))}</span>
							<span style={{ fontSize: '16px', fontWeight: '600' }}>{product.rating}</span>
						</div>
					</div>
				)}

				{/* Последние отзывы */}
				{product.lastFeedbacks ? (
					Object.entries(product.lastFeedbacks).map(([key, feedback]) => {
						if (!feedback || (!feedback.text && !feedback.pros && !feedback.cons)) {
							return null
						}

						const rating = product.lastFeedbacksRating?.[`rate_${key.split('_')[1]}` as keyof typeof product.lastFeedbacksRating]
						
						return (
							<div key={key} className={styles.review} style={{ marginBottom: '16px' }}>
								<div className={styles.reviewHeader}>
									<strong>Отзыв {key.split('_')[1]}</strong>
									{rating && (
										<span style={{ fontSize: '14px' }}>
											{'⭐'.repeat(rating)} {rating}/5
										</span>
									)}
								</div>
								
								{feedback.text && (
									<div style={{ marginBottom: '8px' }}>
										<p className={styles.reviewText}>{feedback.text}</p>
									</div>
								)}
								
								{feedback.pros && (
									<div style={{ marginBottom: '8px' }}>
										<strong style={{ color: '#dc3545' }}>Минусы:</strong>
										<p className={styles.reviewText}>{feedback.pros}</p>
									</div>
								)}
								
								{feedback.cons && (
									<div style={{ marginBottom: '8px' }}>
										<strong style={{ color: '#28a745' }}>Плюсы:</strong>
										<p className={styles.reviewText}>{feedback.cons}</p>
									</div>
								)}
							</div>
						)
					})
				) : product.lastFeedbackText ? (
					<div className={styles.review}>
						<div className={styles.reviewHeader}>
							<strong>Последний отзыв</strong>
							{product.lastFeedbackRecentRating && (
								<span>{'⭐'.repeat(product.lastFeedbackRecentRating)} {product.lastFeedbackRecentRating}/5</span>
							)}
						</div>
						<p className={styles.reviewText}>{product.lastFeedbackText}</p>
					</div>
				) : (
					<div className={styles.review}>
						<p className={styles.reviewText}>Пока нет отзывов</p>
					</div>
				)}
			</div>
		</div>
	)
}
