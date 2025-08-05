// components/TopBar/TopBar.tsx
import { ArrowDownUpIcon, Filter } from 'lucide-react'
import { Search } from '../../ui/Search/Search'
import styles from './TopBar.module.css'

export function TopBar() {
	const theme = window.Telegram?.WebApp?.themeParams
	const iconColor = theme?.text_color || '#000000'
	const secondaryBg = theme?.secondary_bg_color || '#f4f4f5'

	const handleSort = () => {
		console.log('Сортировка')
		// Можно добавить popup, модалку и т.д.
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
	}

	const handleFilter = () => {
		console.log('Фильтры')
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium')
	}

	return (
		<div className={styles.topBar}>
			{/* Поиск */}
			<div className={styles.searchSection}>
				<Search />
			</div>

			{/* Кнопки справа */}
			<div className={styles.actions}>
				<button
					onClick={handleSort}
					className={styles.iconButton}
					style={{ backgroundColor: secondaryBg }}
					aria-label='Сортировка'
				>
					<ArrowDownUpIcon size={20} color={iconColor} />
				</button>

				<button
					onClick={handleFilter}
					className={styles.iconButton}
					style={{ backgroundColor: secondaryBg }}
					aria-label='Фильтры'
				>
					<Filter size={20} color={iconColor} />
				</button>
			</div>
		</div>
	)
}
