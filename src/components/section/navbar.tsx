import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export function MobileNavbar() {
	const location = useLocation()

	// Получаем цвета из Telegram WebApp
	const theme = window.Telegram?.WebApp?.themeParams
	const backgroundColor = theme?.bg_color || '#ffffff'
	const textColor = theme?.text_color || '#000000'
	const accentColor = theme?.accent_text_color || '#007EE5'

	const isFavoritesActive = location.pathname === '/favorites'
	const isSearchActive =
		location.pathname === '/' || location.pathname === '/search'

	return (
		<nav
			className={styles.navbar}
			style={{
				backgroundColor,
				borderColor: theme?.secondary_bg_color || '#e0e0e0',
			}}
		>
			<div className={styles.container}>
				<Link
					to='/search'
					className={`${styles.link} ${isSearchActive ? styles.active : ''}`}
					style={{ color: isSearchActive ? accentColor : textColor }}
				>
					🔍 Поиск
				</Link>
				<Link
					to='/favorites'
					className={`${styles.link} ${isFavoritesActive ? styles.active : ''}`}
					style={{ color: isFavoritesActive ? accentColor : textColor }}
				>
					❤️ Избранное
				</Link>
			</div>
		</nav>
	)
}
