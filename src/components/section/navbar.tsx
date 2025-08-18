import { Link, useLocation } from 'react-router-dom'
import { Heart, Search as SearchIcon } from 'lucide-react'
import { BRAND_COLOR } from '../../constants/colors'
import { isPathActive } from '../../utils/pathUtils'
import styles from './Navbar.module.css'

export function MobileNavbar() {
	const location = useLocation()

	const backgroundColor = 'var(--color-bg)'
	const textColor = 'var(--color-text)'
	const accentColor = 'var(--color-accent)'

	// Используем утилитарную функцию для определения активных страниц
	const isFavoritesActive = isPathActive(location.pathname, ['/favorites'])
	const isSearchActive = isPathActive(location.pathname, ['/', '/search'])

	return (
		<nav
			className={styles.navbar}
			style={{
				backgroundColor,
				borderColor: 'var(--color-border)',
			}}
		>
			<div className={styles.container}>
                <Link
                    to={{ pathname: '/search', search: window.location.search }}
					className={`${styles.link} ${isSearchActive ? styles.active : ''}`}
					style={{ color: isSearchActive ? accentColor : textColor }}
				>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<SearchIcon 
							size={18} 
							color={isSearchActive ? BRAND_COLOR : textColor} 
						/>
						Поиск
					</span>
				</Link>
				<Link
                    to={{ pathname: '/favorites', search: window.location.search }}
					className={`${styles.link} ${isFavoritesActive ? styles.active : ''}`}
					style={{ color: isFavoritesActive ? accentColor : textColor }}
				>
					<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<Heart 
							size={18} 
							color={isFavoritesActive ? BRAND_COLOR : textColor} 
						/>
						Избранное
					</span>
				</Link>
			</div>
		</nav>
	)
}
