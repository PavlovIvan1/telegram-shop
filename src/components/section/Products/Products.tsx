import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { useSearchDebounce } from '../../../hooks/useDebounce'
import { useProducts } from '../../../hooks/useProducts'
import { ProductCard } from '../../ProductCard/ProductCard'
import { TopBar } from '../TopBar/TopBar'

export function Products() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState('')
	const [sortOption, setSortOption] = useState('name-asc')
	const [filterCategory] = useState('')

	// Используем debounce для поиска
	const { debouncedSearch, isSearching } = useSearchDebounce(searchValue, 300)

	// Используем оптимизированный хук для загрузки продуктов
	const { data: products = [], isLoading, error } = useProducts(
		debouncedSearch || 'айфон'
	)

	// Мемоизируем функцию поиска
	const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			console.log('Нажат Enter, запускаем поиск')
            const next = new URLSearchParams(searchParams)
            if (searchValue) next.set('q', searchValue)
            else next.delete('q')
            setSearchParams(next)
		}
	}, [searchValue, searchParams, setSearchParams])

	// Восстанавливаем поиск из URL при монтировании
	useEffect(() => {
		const q = searchParams.get('q') || ''
		if (q !== searchValue) setSearchValue(q)
	}, [searchParams, searchValue])

	// Отладочная информация
	useEffect(() => {
		console.log('Products Debug:', {
			searchValue,
			debouncedSearch,
			isSearching,
			productsCount: products.length,
			isLoading,
			error: error?.message
		})
	}, [searchValue, debouncedSearch, isSearching, products.length, isLoading, error])

	// Мемоизируем фильтрацию
	const filteredProducts = useMemo(() => {
		return products
			.filter(product => {
				const search = searchValue.toLowerCase().trim()
				if (!search) return true

				return (
					product.name.toLowerCase().includes(search) ||
					product.price.toLowerCase().includes(search) ||
					product.category?.toLowerCase().includes(search) ||
					product.tags?.some(tag => tag.toLowerCase().includes(search))
				)
			})
			.filter(product => {
				if (!filterCategory) return true
				return product.category === filterCategory
			})
	}, [products, searchValue, filterCategory])

	// Мемоизируем функцию парсинга цены
	const parsePrice = useCallback((priceStr: string): number => {
		return Number(priceStr.replace(/[^\d]/g, ''))
	}, [])

	// Мемоизируем сортировку
	const sortedProducts = useMemo(() => {
		return [...filteredProducts].sort((a, b) => {
			switch (sortOption) {
				case 'name-asc':
					return a.name.localeCompare(b.name)
				case 'name-desc':
					return b.name.localeCompare(a.name)
				case 'price-asc':
					return parsePrice(a.price) - parsePrice(b.price)
				case 'price-desc':
					return parsePrice(b.price) - parsePrice(a.price)
				default:
					return 0
			}
		})
	}, [filteredProducts, sortOption, parsePrice])

	// Мемоизируем компонент загрузки
	const loadingComponent = useMemo(() => (
		<div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
			<BeatLoader color={window.Telegram?.WebApp?.themeParams?.button_color || '#007EE5'} size={10} />
		</div>
	), [])

	// Мемоизируем компонент ошибки
	const errorComponent = useMemo(() => (
		<div style={{ padding: '20px', color: 'red' }}>Ошибка: {error?.message}</div>
	), [error?.message])

	// Мемоизируем индикатор поиска
	const searchIndicator = useMemo(() => {
		if (!searchValue.trim()) return null
		
		return (
			<div style={{ 
				padding: '8px 16px', 
				textAlign: 'center', 
				color: '#666',
				fontSize: '14px',
				backgroundColor: '#f5f5f5',
				borderRadius: '8px',
				margin: '8px 10px'
			}}>
				{isSearching ? 'Поиск...' : `Найдено товаров: ${sortedProducts.length}`}
			</div>
		)
	}, [searchValue, isSearching, sortedProducts.length])

	return (
		<div>
			{/* Отладочная информация в разработке */}
			{import.meta.env.DEV && (
				<div style={{ 
					padding: '8px', 
					backgroundColor: '#f0f0f0', 
					fontSize: '12px', 
					fontFamily: 'monospace',
					borderBottom: '1px solid #ccc'
				}}>
					Search: "{searchValue}" | Debounced: "{debouncedSearch}" | 
					Searching: {isSearching ? 'Yes' : 'No'} | 
					Products: {products.length} | 
					Filtered: {filteredProducts.length}
				</div>
			)}

			{/* Тестовый input для диагностики */}
			{import.meta.env.DEV && (
				<div style={{ 
					padding: '8px', 
					backgroundColor: '#e8f4fd', 
					borderBottom: '1px solid #007EE5',
					marginBottom: '8px'
				}}>
					<strong>Тестовый ввод:</strong>
					<input
						type="text"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						placeholder="Тест ввода..."
						style={{
							marginLeft: '8px',
							padding: '4px 8px',
							border: '1px solid #007EE5',
							borderRadius: '4px',
							fontSize: '14px'
						}}
					/>
					<span style={{ marginLeft: '8px', color: '#666' }}>
						Длина: {searchValue.length}
					</span>
				</div>
			)}

			<TopBar
				searchValue={searchValue}
				onSearchChange={e => setSearchValue(e.target.value)}
				onSearchKeyDown={handleSearchKeyDown}
				sortOption={sortOption}
				onSortChange={setSortOption}
				filterCategory={filterCategory}
				onFilterChange={() => {}} // Временно отключаем фильтры
			/>

			{/* Индикатор поиска */}
			{searchIndicator}

			{/* Показываем загрузку только для контента, не для всего компонента */}
			{isLoading ? (
				loadingComponent
			) : error ? (
				errorComponent
			) : (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						padding: '0 10px',
						gap: '8px',
						marginTop: '8px',
					}}
				>
					{sortedProducts.length === 0 ? (
						<div
							style={{
								width: '100%',
								textAlign: 'center',
								color: '#999',
								padding: '20px',
								fontSize: '14px',
							}}
						>
							{searchValue ? 'Ничего не найдено' : 'Введите поисковый запрос'}
						</div>
					) : (
						sortedProducts.map(product => (
							<ProductCard key={product.id} product={product} />
						))
					)}
				</div>
			)}
		</div>
	)
}
