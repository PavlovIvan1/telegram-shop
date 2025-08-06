import React from 'react'

interface ButtonProps {
	children: React.ReactNode
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	className?: string
	w?: string
	h?: string
}

export function Button(props: ButtonProps) {
	const {
		children,
		onClick,
		type = 'button',
		disabled = false,
		className = '',
		w = '',
		h = '',
		...rest
	} = props

	const theme = window.Telegram?.WebApp?.themeParams
	const buttonColor = theme?.button_color || '#007EE5'

	return (
		<button
			style={{
				width: w,
				height: h,
				backgroundColor: buttonColor,
				border: 'none',
				borderRadius: '0.8rem',
				display: 'flex',
				alignItems: 'center',
				fontSize: '14px',
				fontWeight: '500',
				gap: '5px',
				justifyContent: 'center',
			}}
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={className}
			{...rest}
		>
			{children}
		</button>
	)
}
