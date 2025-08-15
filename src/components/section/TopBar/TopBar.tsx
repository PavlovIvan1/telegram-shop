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
	onSearchKeyDown,
}: TopBarProps) {
	const [isSortOpen, setIsSortOpen] = useState(false)
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	const theme = window.Telegram?.WebApp?.themeParams
	const textColor = theme?.text_color || '#000000'
	const hintColor = theme?.hint_color || '#999999'
	const secondaryBg = theme?.secondary_bg_color || '#f4f4f5'
	const buttonColor = theme?.button_color || '#007EE5'

	// Отладочная информация
	useEffect(() => {
		console.log('TopBar render:', { searchValue, sortOption, filterCategory })
	}, [searchValue, sortOption, filterCategory])

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
			{/* Отладочная информация */}
			{import.meta.env.DEV && (
				<div style={{ 
					padding: '4px', 
					backgroundColor: '#fff3cd', 
					fontSize: '10px', 
					fontFamily: 'monospace',
					borderBottom: '1px solid #ffc107',
					color: '#856404'
				}}>
					TopBar: searchValue="{searchValue}" | length: {searchValue.length}
				</div>
			)}

			{/* Поиск */}
			<div className={styles.searchSection}>
				<Search
					value={searchValue}
					onChange={onSearchChange}
					onKeyDown={onSearchKeyDown}
				/>
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
