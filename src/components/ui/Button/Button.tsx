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

	return (
		<button
			style={{ width: w, height: h }}
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
