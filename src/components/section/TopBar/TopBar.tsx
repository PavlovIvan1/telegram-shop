// // components/TopBar/TopBar.tsx
// import { ArrowDownUpIcon, Filter } from 'lucide-react'
// import { Search } from '../../ui/Search/Search'
// import styles from './TopBar.module.css'

// export function TopBar() {
// 	const theme = window.Telegram?.WebApp?.themeParams
// 	const iconColor = theme?.text_color || '#000000'
// 	const secondaryBg = theme?.secondary_bg_color || '#f4f4f5'

// 	const handleSort = () => {
// 		console.log('Сортировка')
// 		// Можно добавить popup, модалку и т.д.
// 		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
// 	}

// 	const handleFilter = () => {
// 		console.log('Фильтры')
// 		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium')
// 	}

// 	return (
// 		<div className={styles.topBar}>
// 			{/* Поиск */}
// 			<div className={styles.searchSection}>
// 				<Search />
// 			</div>

// 			{/* Кнопки справа */}
// 			<div className={styles.actions}>
// 				<button
// 					onClick={handleSort}
// 					className={styles.iconButton}
// 					style={{ backgroundColor: secondaryBg }}
// 					aria-label='Сортировка'
// 				>
// 					<ArrowDownUpIcon size={20} color={iconColor} />
// 				</button>

// 				<button
// 					onClick={handleFilter}
// 					className={styles.iconButton}
// 					style={{ backgroundColor: secondaryBg }}
// 					aria-label='Фильтры'
// 				>
// 					<Filter size={20} color={iconColor} />
// 				</button>
// 			</div>
// 		</div>
// 	)
// }

// components/TopBar/TopBar.tsx
// import { ArrowDownUpIcon, Filter } from 'lucide-react'
// import { Search } from '../../ui/Search/Search'
// import styles from './TopBar.module.css'

// interface TopBarProps {
// 	searchValue: string
// 	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
// 	onSort?: () => void
// 	onFilter?: () => void
// }

// export function TopBar({
// 	searchValue,
// 	onSearchChange,
// 	onSort,
// 	onFilter,
// }: TopBarProps) {
// 	const theme = window.Telegram?.WebApp?.themeParams
// 	const iconColor = theme?.text_color || '#000000'
// 	const secondaryBg = theme?.secondary_bg_color || '#f4f4f5'

// 	const handleSort = () => {
// 		onSort?.()
// 		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
// 	}

// 	const handleFilter = () => {
// 		onFilter?.()
// 		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium')
// 	}

// 	return (
// 		<div className={styles.topBar}>
// 			{/* Поиск */}
// 			<div className={styles.searchSection}>
// 				<Search value={searchValue} onChange={onSearchChange} />
// 			</div>

// 			{/* Кнопки справа */}
// 			<div className={styles.actions}>
// 				<button
// 					onClick={handleSort}
// 					className={styles.iconButton}
// 					style={{ backgroundColor: secondaryBg }}
// 					aria-label='Сортировка'
// 				>
// 					<ArrowDownUpIcon size={20} color={iconColor} />
// 				</button>

// 				<button
// 					onClick={handleFilter}
// 					className={styles.iconButton}
// 					style={{ backgroundColor: secondaryBg }}
// 					aria-label='Фильтры'
// 				>
// 					<Filter size={20} color={iconColor} />
// 				</button>
// 			</div>
// 		</div>
// 	)
// }

// components/TopBar/TopBar.tsx
import { ArrowDownUpIcon, Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Search } from '../../ui/Search/Search'
import styles from './TopBar.module.css'

interface TopBarProps {
	searchValue: string
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	sortOption: string
	onSortChange: (value: string) => void
	filterCategory: string
	onFilterChange: (value: string) => void
	onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function TopBar({
	searchValue,
	onSearchChange,
	sortOption,
	onSortChange,
	filterCategory,
	onFilterChange,
}: TopBarProps) {
	const [isSortOpen, setIsSortOpen] = useState(false)
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	const theme = window.Telegram?.WebApp?.themeParams
	const textColor = theme?.text_color || '#000000'
	const hintColor = theme?.hint_color || '#999999'
	const secondaryBg = theme?.secondary_bg_color || '#f4f4f5'
	const buttonColor = theme?.button_color || '#007EE5'

	// Закрытие при клике мимо
	useEffect(() => {
		const handleClickOutside = () => {
			setIsSortOpen(false)
			setIsFilterOpen(false)
		}
		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	const toggleSort = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsSortOpen(prev => !prev)
		setIsFilterOpen(false)
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
	}

	const toggleFilter = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsFilterOpen(prev => !prev)
		setIsSortOpen(false)
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium')
	}

	const handleSortSelect = (value: string) => {
		onSortChange(value)
		setIsSortOpen(false)
	}

	const handleFilterSelect = (value: string) => {
		onFilterChange(value)
		setIsFilterOpen(false)
	}

	return (
		<div className={styles.topBar}>
			{/* Поиск */}
			<div className={styles.searchSection}>
				<Search value={searchValue} onChange={onSearchChange} />
			</div>

			{/* Кнопка сортировки + dropdown */}
			<div className={styles.dropdown} style={{ position: 'relative' }}>
				<button
					onClick={toggleSort}
					className={styles.iconButton}
					style={{ backgroundColor: secondaryBg }}
					aria-label='Сортировка'
				>
					<ArrowDownUpIcon size={20} color={textColor} />
				</button>

				{isSortOpen && (
					<div
						className={styles.dropdownMenu}
						style={{
							backgroundColor: secondaryBg,
							borderColor: hintColor,
							boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
						}}
					>
						{[
							{ value: 'name-asc', label: 'Имя ↑' },
							{ value: 'name-desc', label: 'Имя ↓' },
							{ value: 'price-asc', label: 'Цена ↑' },
							{ value: 'price-desc', label: 'Цена ↓' },
						].map(option => (
							<div
								key={option.value}
								className={styles.dropdownItem}
								style={{
									color: sortOption === option.value ? buttonColor : textColor,
								}}
								onClick={() => handleSortSelect(option.value)}
							>
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Кнопка фильтров + dropdown */}
			<div className={styles.dropdown} style={{ position: 'relative' }}>
				<button
					onClick={toggleFilter}
					className={styles.iconButton}
					style={{ backgroundColor: secondaryBg }}
					aria-label='Фильтры'
				>
					<Filter size={20} color={textColor} />
				</button>

				{isFilterOpen && (
					<div
						className={styles.dropdownMenu}
						style={{
							backgroundColor: secondaryBg,
							borderColor: hintColor,
							boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
						}}
					>
						{[
							{ value: '', label: 'Все категории' },
							{ value: 'smartphones', label: 'Смартфоны' },
							{ value: 'headphones', label: 'Наушники' },
							{ value: 'smartwatches', label: 'Часы' },
							{ value: 'tablets', label: 'Планшеты' },
						].map(option => (
							<div
								key={option.value}
								className={styles.dropdownItem}
								style={{
									color:
										filterCategory === option.value ? buttonColor : textColor,
								}}
								onClick={() => handleFilterSelect(option.value)}
							>
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
