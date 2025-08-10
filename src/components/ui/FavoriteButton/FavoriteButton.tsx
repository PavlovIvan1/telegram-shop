// components/ui/Button/Button.tsx
import React from 'react'

interface ButtonProps {
	children: React.ReactNode
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	className?: string
	w?: string
	h?: string
	bgColor?: string
	style?: React.CSSProperties
}

export function FavoriteButton({
	children,
	onClick,
	type = 'button',
	disabled = false,
	className = '',
	w = '',
	h = '',
	bgColor,
	style,
}: ButtonProps) {
	const theme = window.Telegram?.WebApp?.themeParams
	const telegramButtonColor = theme?.button_color || '#007EE5'
	const background = bgColor || telegramButtonColor

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={className}
			style={{
				width: w,
				height: h,
				backgroundColor: background,
				border: 'none',
				borderRadius: '8px',
				display: 'flex',
				alignItems: 'center',
				fontSize: '14px',
				fontWeight: '500',
				gap: '5px',
				transition: 'all 0.15s ease',
				...style,
			}}
		>
			{children}
		</button>
	)
}
