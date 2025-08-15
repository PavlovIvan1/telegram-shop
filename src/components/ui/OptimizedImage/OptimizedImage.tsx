import { memo, forwardRef } from 'react'
import { useImageOptimization } from '../../../hooks/useImageOptimization'

interface OptimizedImageProps {
	src: string
	alt: string
	className?: string
	style?: React.CSSProperties
	preload?: boolean
	lazy?: boolean
	placeholder?: string
	onLoad?: () => void
	onError?: () => void
	onClick?: () => void
}

export const OptimizedImage = memo(forwardRef<HTMLImageElement, OptimizedImageProps>(
	({ 
		src, 
		alt, 
		className, 
		style, 
		preload = false, 
		lazy = true, 
		placeholder = '',
		onLoad,
		onError,
		onClick,
		...props 
	}, ref) => {
		const { isLoaded, currentSrc } = useImageOptimization(src, {
			preload,
			lazy,
			placeholder,
		})

		const handleLoad = () => {
			onLoad?.()
		}

		const handleError = () => {
			onError?.()
		}

		const handleClick = () => {
			onClick?.()
		}

		return (
			<img
				ref={ref}
				src={currentSrc}
				alt={alt}
				className={className}
				style={{
					...style,
					opacity: isLoaded ? 1 : 0.7,
					transition: 'opacity 0.3s ease-in-out',
				}}
				loading={lazy ? 'lazy' : 'eager'}
				onLoad={handleLoad}
				onError={handleError}
				onClick={handleClick}
				{...props}
			/>
		)
	}
))

OptimizedImage.displayName = 'OptimizedImage'
