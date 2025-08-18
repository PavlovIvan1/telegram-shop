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

	return (
		<button
			style={{
				width: w,
				height: h,
				backgroundColor: 'var(--color-accent-button)',
				// Override var(--color-text) locally so global !important uses white
				['--color-text' as any]: '#ffffff',
				border: 'none',
				borderRadius: '8px',
				display: 'flex',
				alignItems: 'center',
				fontSize: '14px',
				fontWeight: '500',
				gap: '5px',
				justifyContent: 'center',
				cursor: 'pointer',
				transition: 'all 0.2s ease',
			} as React.CSSProperties}
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={className}
			{...rest}
			onMouseEnter={(e) => {
				if (!disabled) {
					e.currentTarget.style.backgroundColor = 'rgba(167,58,253,1)'
					e.currentTarget.style.transform = 'scale(1.02)'
				}
			}}
			onMouseLeave={(e) => {
				if (!disabled) {
					e.currentTarget.style.backgroundColor = 'var(--color-accent-button)'
					e.currentTarget.style.transform = 'scale(1)'
				}
			}}
		>
			{children}
		</button>
	)
}
