// components/Search/Search.tsx
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import styles from './Search.module.css'

export function Search() {
	const [query, setQuery] = useState('')

	const theme = window.Telegram?.WebApp?.themeParams
	const textColor = theme?.text_color || '#000000'
	const hintColor = theme?.hint_color || '#999999'
	const controlColor = theme?.button_color || '#007EE5'
	const secondaryBg = theme?.secondary_bg_color || '#f4f4f5'

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value)
	}

	return (
		<div className={styles.searchContainer}>
			<div
				className={styles.searchWrapper}
				style={{
					backgroundColor: secondaryBg,
					borderRadius: 12,
				}}
			>
				{/* Иконка лупы */}
				{/* <span className={styles.searchIcon} style={{ color: hintColor }}>
					🔍
				</span> */}
				<SearchIcon size={18} color={hintColor} className={styles.searchIcon} />
				{/* Поле ввода */}
				<input
					type='text'
					value={query}
					onChange={handleChange}
					placeholder='Поиск ...'
					className={styles.searchInput}
					style={{
						color: textColor,
						caretColor: controlColor,
						backgroundColor: 'transparent',
						fontSize: 16,
					}}
				/>
			</div>
		</div>
	)
}
