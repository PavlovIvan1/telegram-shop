import React from 'react'
import styles from './Button.module.css'

interface ButtonProps {
	children: React.ReactNode
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	className?: string
}

export function Button(props: ButtonProps) {
	const {
		children,
		onClick,
		type = 'button',
		disabled = false,
		className = '',
		...rest
	} = props

	return (
		<button
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
