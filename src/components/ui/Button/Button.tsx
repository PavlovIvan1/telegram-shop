import React from 'react'
import styles from './Button.module.css'

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
				borderRadius: '1.5rem',
			}}
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={styles.button}
			{...rest}
		>
			{children}
		</button>
	)
}
