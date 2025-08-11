// import 'keen-slider/keen-slider.min.css'
// import { useKeenSlider } from 'keen-slider/react'
// import { ArrowLeft } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import type { Product } from '../data/products'
// import { productMap } from '../data/products'
// import styles from './ProductPage.module.css'

// export function ProductPage() {
// 	const { id = '' } = useParams()
// 	const navigate = useNavigate()
// 	const [product, setProduct] = useState<Product | null>(null)

// 	console.log('productMap:', productMap)

// 	useEffect(() => {
// 		console.log('ID из URL:', id)
// 		if (id && productMap[id]) {
// 			setProduct(productMap[id])
// 		} else {
// 			console.warn('Товар не найден в productMap:', id)
// 			setProduct(null)
// 		}
// 	}, [id])

// 	const images = product ? [product.image] : []
// 	const [sliderRef] = useKeenSlider<HTMLDivElement>({
// 		loop: true,
// 		slides: {
// 			perView: 1,
// 			spacing: 10,
// 		},
// 	})

// 	// ✅ Теперь можно делать early return
// 	if (!product) {
// 		return (
// 			<div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
// 				Товар не найден
// 			</div>
// 		)
// 	}

// 	// Пример отзывов
// 	const reviews = [
// 		{
// 			id: 1,
// 			author: 'Анна',
// 			rating: 5,
// 			text: 'Отличный телефон, камера супер!',
// 			date: '10 мая 2025',
// 		},
// 		{
// 			id: 2,
// 			author: 'Дмитрий',
// 			rating: 4,
// 			text: 'Хорошее устройство, но цена высоковата.',
// 			date: '5 мая 2025',
// 		},
// 	]

// 	return (
// 		<div className={styles.container}>
// 			{/* Хедер */}
// 			<header className={styles.header}>
// 				<button className={styles.backButton} onClick={() => navigate(-1)}>
// 					<ArrowLeft size={20} />
// 				</button>
// 				<h1 className={styles.title}>Товар</h1>
// 			</header>

// 			{/* Слайдер */}
// 			<div className={styles.slider}>
// 				<div
// 					ref={sliderRef}
// 					className='keen-slider'
// 					style={{ borderRadius: '12px', overflow: 'hidden' }}
// 				>
// 					{images.map((src, index) => (
// 						<div className='keen-slider__slide' key={index}>
// 							<img
// 								src={src}
// 								alt={`Фото ${index + 1}`}
// 								style={{
// 									width: '100%',
// 									objectFit: 'cover',
// 								}}
// 							/>
// 						</div>
// 					))}
// 				</div>
// 			</div>

// 			{/* Информация о товаре */}
// 			<div className={styles.info}>
// 				<h2 className={styles.productName}>{product.name}</h2>
// 				<div className={styles.price}>{product.price}</div>
// 				<div className={styles.description}>
// 					<h3>Описание</h3>
// 					<p>
// 						{product.name} — это мощное устройство с отличной камерой, высокой
// 						производительностью и стильным дизайном. Подходит для повседневного
// 						использования и профессиональных задач.
// 					</p>
// 				</div>
// 			</div>

// 			{/* Отзывы */}
// 			<div className={styles.reviews}>
// 				<h3>Отзывы ({reviews.length})</h3>
// 				{reviews.map(review => (
// 					<div key={review.id} className={styles.review}>
// 						<div className={styles.reviewHeader}>
// 							<strong>{review.author}</strong>
// 							<span>{'⭐'.repeat(review.rating)}</span>
// 							<small>{review.date}</small>
// 						</div>
// 						<p className={styles.reviewText}>{review.text}</p>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	)
// }

import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import type { Product } from '../data/products'
import { productMap } from '../data/products'
import styles from './ProductPage.module.css'

export function ProductPage() {
	const { id = '' } = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const [product, setProduct] = useState<Product | null>(null)

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

  const images = product ? (product.images && product.images.length > 0 ? product.images : [product.image].filter(Boolean)) : []
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // считем, что продукт загружен когда setProduct отработал
    setIsLoading(false)
  }, [product])

  if (isLoading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <BeatLoader color={window.Telegram?.WebApp?.themeParams?.button_color || '#007EE5'} size={10} />
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

  // Lazy-load HLS only when needed and cleanup on unmount
  useEffect(() => {
    if (!product || !product.video || !videoRef.current) return

    const videoEl = videoRef.current
    const videoUrl = product.video as string
    const isM3U8 = /\.m3u8($|\?)/i.test(videoUrl)
    let hls: any | null = null
    // let removed = false

    function attachSource() {
      // Safari iOS supports HLS natively
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
          // Fallback: set src directly
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
      // removed = true
      try { videoEl.pause() } catch {}
      try {
        // очищаем src
        videoEl.removeAttribute('src')
        videoEl.load()
      } catch {}
      try { hls && hls.destroy && hls.destroy() } catch {}
    }
  }, [product])

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
                      <div style={{ minWidth: '100%', scrollSnapAlign: 'start', aspectRatio: '16/9' }}>
                        <video
                          ref={videoRef}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                          controls
                          preload="none"
                          playsInline
                          // src устанавливается динамически (для HLS) в useEffect
                        />
                      </div>
                    )}
                    {images.map((src, index) => (
                        <div key={index} style={{ minWidth: '100%', scrollSnapAlign: 'start', aspectRatio: '16/9' }}>
                            <img
                                src={src}
                                alt={`Фото ${index + 1}`}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
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
                      style={{
                        display: 'inline-block',
                        padding: '10px 14px',
                        borderRadius: 12,
                        textDecoration: 'none',
                        background: (window.Telegram?.WebApp?.themeParams?.button_color || '#007EE5'),
                        color: (window.Telegram?.WebApp?.themeParams?.button_text_color || '#ffffff'),
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
}
