import { useEffect, useRef, useState } from 'react'
import styles from './LazyImage.module.css'

interface LazyImageProps {
	src: string
	alt: string
	className?: string
	style?: React.CSSProperties
	placeholder?: string
	onLoad?: () => void
	onError?: () => void
}

export function LazyImage({ 
	src, 
	alt, 
	className, 
	style, 
	placeholder = '',
	onLoad,
	onError 
}: LazyImageProps) {
	const [isLoaded, setIsLoaded] = useState(false)
	const [imageSrc, setImageSrc] = useState(placeholder || src)
	const [hasError, setHasError] = useState(false)
	const imgRef = useRef<HTMLImageElement>(null)

	useEffect(() => {
		if (!src) return

		// Создаем Intersection Observer для lazy loading
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Изображение попало в область видимости, загружаем его
						setImageSrc(src)
						observer.unobserve(entry.target)
					}
				})
			},
			{
				rootMargin: '50px', // Начинаем загружать за 50px до появления
				threshold: 0.1
			}
		)

		if (imgRef.current) {
			observer.observe(imgRef.current)
		}

		return () => {
			if (imgRef.current) {
				observer.unobserve(imgRef.current)
			}
		}
	}, [src])

	const handleLoad = () => {
		setIsLoaded(true)
		setHasError(false)
		onLoad?.()
	}

	const handleError = () => {
		setHasError(true)
		onError?.()
	}

	return (
		<div 
			className={`${styles.imageContainer} ${className || ''}`}
			style={style}
		>
			{/* Placeholder пока изображение не загружено */}
			{!isLoaded && !hasError && (
				<div className={styles.placeholder}>
					<div className={styles.placeholderContent}>
						<div className={styles.loadingSpinner}></div>
					</div>
				</div>
			)}

			{/* Основное изображение */}
			<img
				ref={imgRef}
				src={imageSrc}
				alt={alt}
				className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
				onLoad={handleLoad}
				onError={handleError}
				style={{
					opacity: isLoaded ? 1 : 0,
					transition: 'opacity 0.3s ease-in-out'
				}}
			/>

			{/* Fallback при ошибке */}
			{hasError && (
				<div className={styles.errorFallback}>
					<div className={styles.errorIcon}>📷</div>
					<span className={styles.errorText}>Ошибка загрузки</span>
				</div>
			)}
		</div>
	)
}
