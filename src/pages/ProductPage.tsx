import { ArrowLeft } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import type { Product } from '../data/products'
import { productMap } from '../data/products'
import { useProduct } from '../hooks/useProducts'
import styles from './ProductPage.module.css'

// Мемоизируем компонент для предотвращения лишних ререндеров
export const ProductPage = memo(function ProductPage() {
	const { id = '' } = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const [product, setProduct] = useState<Product | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const videoRef = useRef<HTMLVideoElement | null>(null)

	// Используем оптимизированный хук для загрузки продукта
	const { data: backendProduct, isLoading: isBackendLoading, error: backendError } = useProduct(id)

	// Мемоизируем функцию навигации назад
	const handleBackClick = useCallback(() => {
		navigate(-1)
	}, [navigate])

	// Оптимизируем загрузку продукта
	useEffect(() => {
		let mounted = true
		
		const loadProduct = async () => {
			// 1. Сначала пробуем взять товар из location.state
			if (location.state?.product) {
				if (mounted) {
					setProduct(location.state.product)
					setIsLoading(false)
				}
				return
			}
			
			// 2. Если нет, ищем в productMap
			if (id && productMap[id]) {
				if (mounted) {
					setProduct(productMap[id])
					setIsLoading(false)
				}
				return
			}
			
			// 3. Если продукт не найден
			if (mounted) {
				setProduct(null)
				setIsLoading(false)
			}
		}

		loadProduct()

		return () => {
			mounted = false
		}
	}, [id, location.state])

	// Обновляем продукт когда данные с бэкенда загружены
	useEffect(() => {
		if (backendProduct && !product) {
			setProduct(backendProduct)
			setIsLoading(false)
		}
	}, [backendProduct, product])

	// Мемоизируем массив изображений
	const images = useMemo(() => {
		if (!product) return []
		return product.images && product.images.length > 0 
			? product.images 
			: [product.image].filter(Boolean)
	}, [product])

	// Мемоизируем стили для кнопки
	const buttonStyles = useMemo(() => ({
		display: 'inline-block',
		padding: '10px 14px',
		borderRadius: 12,
		textDecoration: 'none',
		background: (window.Telegram?.WebApp?.themeParams?.button_color || '#007EE5'),
		color: (window.Telegram?.WebApp?.themeParams?.button_text_color || '#ffffff'),
		fontWeight: 600,
		fontSize: 14,
	}), [])

	// Lazy-load HLS только когда нужно и cleanup при размонтировании
	useEffect(() => {
		if (!product || !product.video || !videoRef.current) return

		const videoEl = videoRef.current
		const videoUrl = product.video as string
		const isM3U8 = /\.m3u8($|\?)/i.test(videoUrl)
		let hls: any | null = null

		function attachSource() {
			// Safari iOS поддерживает HLS нативно
			if (isM3U8 && (videoEl as any).canPlayType && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
				videoEl.src = videoUrl
				return
			}

			if (!isM3U8) {
				videoEl.src = videoUrl
				return
			}

			function loadScriptOnce(src: string): Promise<void> {
				return new Promise(resolve => {
					if (document.querySelector(`script[data-hlsjs="true"]`)) return resolve()
					const s = document.createElement('script')
					s.src = src
					s.async = true
					s.setAttribute('data-hlsjs', 'true')
					s.onload = () => resolve()
					s.onerror = () => resolve()
					document.head.appendChild(s)
				})
			}

			loadScriptOnce('https://cdn.jsdelivr.net/npm/hls.js@latest').then(() => {
				const Hls = (window as any).Hls
				if (!Hls || !Hls.isSupported()) {
					// Fallback: устанавливаем src напрямую
					videoEl.src = videoUrl
					return
				}
				hls = new Hls({
					autoStartLoad: false, // старт загрузки только по действию пользователя (play)
				})
				hls.loadSource(videoUrl)
				hls.attachMedia(videoEl)
				// начинаем грузить только когда пользователь нажмёт play
				const onPlay = () => {
					try { hls && hls.startLoad() } catch {}
					videoEl.removeEventListener('play', onPlay)
				}
				videoEl.addEventListener('play', onPlay)
			})
		}

		attachSource()

		return () => {
			try { videoEl.pause() } catch {}
			try {
				// очищаем src
				videoEl.removeAttribute('src')
				videoEl.load()
			} catch {}
			try { hls && hls.destroy && hls.destroy() } catch {}
		}
	}, [product])

	// Мемоизируем компонент загрузки
	const loadingComponent = useMemo(() => (
		<div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
			<BeatLoader color={window.Telegram?.WebApp?.themeParams?.button_color || '#007EE5'} size={10} />
		</div>
	), [])

	// Мемоизируем компонент ошибки
	const errorComponent = useMemo(() => (
		<div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
			{backendError ? `Ошибка загрузки: ${backendError.message}` : 'Товар не найден'}
		</div>
	), [backendError])

	// Показываем загрузку если загружается с бэкенда или локально
	if (isLoading || isBackendLoading) {
		return loadingComponent
	}

	if (!product) {
		return errorComponent
	}

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<button className={styles.backButton} onClick={handleBackClick}>
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
							<img
								src={src}
								alt={`Фото ${index + 1}`}
								onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
								style={{ 
									width: '100%', 
									height: 'auto', 
									objectFit: 'contain', 
									borderRadius: '12px' 
								}}
								loading="lazy"
							/>
						</div>
					))}
				</div>
			</div>

			<div className={styles.info}>
				<h2 className={styles.productName}>{product.name}</h2>
				<div className={styles.price}>{product.price}</div>
				{product.link && (
					<div style={{ margin: '8px 0 16px' }}>
						<a
							href={product.link}
							target="_blank"
							rel="noopener noreferrer"
							style={buttonStyles}
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
				{(product.rating || product.lastFeedbackText) ? (
					<div className={styles.review}>
						<div className={styles.reviewHeader}>
							<strong>Оценка</strong>
							{product.rating && <span>{'⭐'.repeat(Math.round(product.rating))} {product.rating}</span>}
							{product.lastFeedbackRecentRating && (
								<small>Последняя: {'⭐'.repeat(product.lastFeedbackRecentRating)}</small>
							)}
						</div>
						{product.lastFeedbackText && (
							<p className={styles.reviewText}>{product.lastFeedbackText}</p>
						)}
					</div>
				) : (
					<div className={styles.review}>
						<p className={styles.reviewText}>Пока нет отзывов</p>
					</div>
				)}
			</div>
		</div>
	)
})
