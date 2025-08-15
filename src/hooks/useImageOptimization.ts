import { useEffect, useRef, useState } from 'react'

interface UseImageOptimizationOptions {
	preload?: boolean
	lazy?: boolean
	placeholder?: string
}

export function useImageOptimization(
	src: string,
	options: UseImageOptimizationOptions = {}
) {
	const { preload = false, lazy = true, placeholder = '' } = options
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState(false)
	const [currentSrc, setCurrentSrc] = useState(placeholder || src)
	const imgRef = useRef<HTMLImageElement | null>(null)

	useEffect(() => {
		if (!src) return

		const img = new Image()
		imgRef.current = img

		const handleLoad = () => {
			setIsLoaded(true)
			setError(false)
			setCurrentSrc(src)
		}

		const handleError = () => {
			setError(true)
			setIsLoaded(false)
		}

		img.addEventListener('load', handleLoad)
		img.addEventListener('error', handleError)

		// Если нужно предзагрузить изображение
		if (preload) {
			img.src = src
		}

		return () => {
			img.removeEventListener('load', handleLoad)
			img.removeEventListener('error', handleError)
		}
	}, [src, preload])

	// Функция для принудительной загрузки изображения
	const loadImage = () => {
		if (imgRef.current && !isLoaded && !error) {
			imgRef.current.src = src
		}
	}

	return {
		isLoaded,
		error,
		currentSrc,
		loadImage,
		imgRef,
	}
}

// Хук для оптимизации множественных изображений
export function useMultipleImagesOptimization(
	srcs: string[],
	options: UseImageOptimizationOptions = {}
) {
	const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
	const [errorImages, setErrorImages] = useState<Set<string>>(new Set())

	useEffect(() => {
		if (!srcs.length) return

		const loadImage = (src: string) => {
			const img = new Image()
			
			img.onload = () => {
				setLoadedImages(prev => new Set([...prev, src]))
			}
			
			img.onerror = () => {
				setErrorImages(prev => new Set([...prev, src]))
			}
			
			img.src = src
		}

		// Загружаем изображения с небольшой задержкой для оптимизации
		srcs.forEach((src, index) => {
			if (options.preload) {
				// Предзагружаем все изображения
				setTimeout(() => loadImage(src), index * 100)
			} else if (index === 0) {
				// Загружаем только первое изображение
				loadImage(src)
			}
		})
	}, [srcs, options.preload])

	const loadSpecificImage = (src: string) => {
		if (!loadedImages.has(src) && !errorImages.has(src)) {
			const img = new Image()
			img.onload = () => {
				setLoadedImages(prev => new Set([...prev, src]))
			}
			img.onerror = () => {
				setErrorImages(prev => new Set([...prev, src]))
			}
			img.src = src
		}
	}

	return {
		loadedImages,
		errorImages,
		loadSpecificImage,
		isImageLoaded: (src: string) => loadedImages.has(src),
		isImageError: (src: string) => errorImages.has(src),
	}
}
