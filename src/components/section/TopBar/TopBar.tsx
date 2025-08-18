// components/TopBar/TopBar.tsx
import { ArrowDownUpIcon, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BRAND_COLOR } from '../../../constants/colors'
import { useTheme } from '../../../theme/ThemeProvider'
import { Search } from '../../ui/Search/Search'
import styles from './TopBar.module.css'

interface TopBarProps {
	searchValue: string
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	sortOption: string
	onSortChange: (value: string) => void
	onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function TopBar({
	searchValue,
	onSearchChange,
	sortOption,
	onSortChange,
	onSearchKeyDown,
}: TopBarProps) {
	const [isSortOpen, setIsSortOpen] = useState(false)
	const { theme, toggleTheme } = useTheme()

	const textColor = 'var(--color-text)'
	const hintColor = 'var(--color-hint)'
	const secondaryBg = 'var(--color-bg-secondary)'
	const buttonColor = 'var(--color-accent)'

	// Закрытие при клике мимо
	useEffect(() => {
		const handleClickOutside = () => {
			setIsSortOpen(false)
		}
		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	const toggleSort = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsSortOpen(prev => !prev)
		window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
	}

	const handleSortSelect = (value: string) => {
		onSortChange(value)
		setIsSortOpen(false)
	}

	return (
		<div className={styles.topBar}>
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
					<ArrowDownUpIcon size={20} color={BRAND_COLOR} />
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


			{/* Кнопка переключения темы */}
			<div className={styles.dropdown} style={{ position: 'relative' }}>
				<button
					onClick={toggleTheme}
					className={styles.iconButton}
					style={{ backgroundColor: secondaryBg }}
					aria-label='Переключить тему'
				>
					{theme === 'light' ? (
						<Moon size={20} color={BRAND_COLOR} />
					) : (
						<Sun size={20} color={BRAND_COLOR} />
					)}
				</button>
			</div>
		</div>
	)
}
