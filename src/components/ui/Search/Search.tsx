// components/Search/Search.tsx
import { Search as SearchIcon } from 'lucide-react'
import { useEffect } from 'react'
import styles from './Search.module.css'

interface SearchProps {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function Search({ value, onChange, onKeyDown }: SearchProps) {
	const theme = window.Telegram?.WebApp?.themeParams
	const textColor = theme?.text_color || '#000000'
	const hintColor = theme?.hint_color || '#999999'
	const accentColor = theme?.accent_text_color || '#007EE5'
	const secondaryBg = theme?.secondary_bg_color || '#f4f4f5'

	// Отладочная информация
	useEffect(() => {
		console.log('Search component render:', { value, valueLength: value.length })
	}, [value])

	return (
		<div className={styles.searchContainer}>
			{/* Отладочная информация */}
			{import.meta.env.DEV && (
				<div style={{ 
					padding: '2px 4px', 
					backgroundColor: '#d1ecf1', 
					fontSize: '8px', 
					fontFamily: 'monospace',
					borderBottom: '1px solid #bee5eb',
					color: '#0c5460'
				}}>
					Search: "{value}" | len: {value.length}
				</div>
			)}

			<div
				className={styles.searchWrapper}
				style={{
					backgroundColor: secondaryBg,
					borderRadius: 12,
				}}
			>
				<SearchIcon size={18} color={hintColor} className={styles.searchIcon} />
				<input
					type='text'
					value={value}
					onChange={(e) => {
						console.log('Search input onChange:', e.target.value)
						onChange(e)
					}}
					onKeyDown={onKeyDown}
					placeholder='Поиск по товарам...'
					className={styles.searchInput}
					style={{
						color: textColor,
						caretColor: accentColor,
						backgroundColor: 'transparent',
						fontSize: 16,
					}}
				/>
			</div>
		</div>
	)
}
