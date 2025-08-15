import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { useProductsQuery } from '../../../hooks/useProductsQuery'
import { ProductCard } from '../../ProductCard/ProductCard'
import { TopBar } from '../TopBar/TopBar'

export function Products() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState('')
	const [sortOption, setSortOption] = useState('name-asc')
	const [filterCategory, setFilterCategory] = useState('')

	// Используем кэшированный хук для загрузки продуктов
	const { data: products = [], isLoading, error } = useProductsQuery(
		searchValue || 'айфон'
	)

	// Восстанавливаем поиск из URL при монтировании
	useEffect(() => {
		const q = searchParams.get('q') || ''
		if (q !== searchValue) setSearchValue(q)
	}, [searchParams, searchValue])

	// Функция поиска
	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			console.log('Нажат Enter, запускаем поиск')
            const next = new URLSearchParams(searchParams)
            if (searchValue) next.set('q', searchValue)
            else next.delete('q')
            setSearchParams(next)
		}
	}

	// Фильтрация
	const filteredProducts = products
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

	// Функция для парсинга цены из строки в число
	function parsePrice(priceStr: string): number {
		return Number(priceStr.replace(/[^\d]/g, ''))
	}

	// Сортировка
	const sortedProducts = [...filteredProducts].sort((a, b) => {
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

    if (isLoading)
        return (
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
                <BeatLoader color={window.Telegram?.WebApp?.themeParams?.button_color || '#007EE5'} size={10} />
            </div>
        )
	if (error)
		return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>

	return (
		<div>
			<TopBar
				searchValue={searchValue}
				onSearchChange={e => setSearchValue(e.target.value)}
				onSearchKeyDown={handleSearchKeyDown}
				sortOption={sortOption}
				onSortChange={setSortOption}
				filterCategory={filterCategory}
				onFilterChange={setFilterCategory}
			/>

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
						Ничего не найдено
					</div>
				) : (
					sortedProducts.map(product => (
						<ProductCard key={product.id} product={product} />
					))
				)}
			</div>
		</div>
	)
}
