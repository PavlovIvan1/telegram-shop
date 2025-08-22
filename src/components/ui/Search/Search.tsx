// components/Search/Search.tsx
import { Search as SearchIcon } from 'lucide-react'
import { BRAND_COLOR } from '../../../constants/colors'
import styles from './Search.module.css'

interface SearchProps {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function Search({ value, onChange, onKeyDown }: SearchProps) {
	const textColor = 'var(--color-text)'
	const accentColor = BRAND_COLOR
	const secondaryBg = 'var(--color-bg-secondary)'

	return (
		<div className={styles.searchContainer}>
			<div
				className={styles.searchWrapper}
				style={{
					backgroundColor: secondaryBg,
					borderRadius: 12,
				}}
			>
				<SearchIcon size={18} color={BRAND_COLOR} className={styles.searchIcon} />
				<input
					type='text'
					value={value}
					onChange={onChange}
					onKeyDown={onKeyDown}
					placeholder='Поиск'
					className={styles.searchInput}
					style={{
						color: textColor,
						caretColor: accentColor,
						backgroundColor: 'transparent',
						fontSize: 16,
					}}
					// Добавляем атрибуты для правильной обработки русских символов
					lang="ru"
					spellCheck="false"
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
				/>
			</div>
		</div>
	)
}
