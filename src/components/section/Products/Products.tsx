// // import { ProductCard } from '../../ProductCard/ProductCard'

// // export function Products() {
// // 	return (
// // 		<>
// // 			<div
// // style={{
// // 	display: 'flex',
// // 	// gap: '4px',
// // 	justifyContent: 'space-between',
// // 	flexWrap: 'wrap',
// // 	padding: '10px',
// // }}
// // 			>
// // 				<ProductCard />
// // 				<ProductCard />
// // 				<ProductCard />
// // 				<ProductCard />
// // 			</div>
// // 		</>
// // 	)
// // }

// // pages/Products.tsx
// import { products } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'

// export function Products() {
// 	return (
// 		<div
// 			style={{
// 				display: 'flex',
// 				// gap: '4px',
// 				justifyContent: 'space-between',
// 				flexWrap: 'wrap',
// 				padding: '10px',
// 			}}
// 		>
// 			{products.map(product => (
// 				<ProductCard key={product.id} product={product} />
// 			))}
// 		</div>
// 	)
// }

// // pages/Products.tsx
// import { useState } from 'react'
// import { products } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { Search } from '../../ui/Search/Search'

// export function Products() {
// 	const [query, setQuery] = useState('')

// 	const filteredProducts = products.filter(product => {
// 		const search = query.toLowerCase().trim()
// 		if (!search) return true

// 		return (
// 			product.name.toLowerCase().includes(search) ||
// 			product.price.toLowerCase().includes(search) ||
// 			product.category?.toLowerCase().includes(search) ||
// 			product.tags?.some(tag => tag.toLowerCase().includes(search))
// 		)
// 	})

// 	return (
// 		<div>
// 			{/* Поисковая строка */}
// 			<div style={{ padding: '0 10px 12px' }}>
// 				<Search value={query} onChange={e => setQuery(e.target.value)} />
// 			</div>

// 			{/* Список товаров */}
// 			<div
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'space-between',
// 					flexWrap: 'wrap',
// 					padding: '0 10px',
// 					gap: '8px',
// 				}}
// 			>
// 				{filteredProducts.length === 0 ? (
// 					<div
// 						style={{
// 							width: '100%',
// 							textAlign: 'center',
// 							color: '#999',
// 							padding: '20px',
// 							fontSize: '14px',
// 						}}
// 					>
// 						Ничего не найдено
// 					</div>
// 				) : (
// 					filteredProducts.map(product => (
// 						<ProductCard key={product.id} product={product} />
// 					))
// 				)}
// 			</div>
// 		</div>
// 	)
// }

// // pages/Products.tsx
// import { useState } from 'react'
// import { products } from '../../../data/products'
// import { ProductCard } from '../../ProductCard/ProductCard'
// import { TopBar } from '../TopBar/TopBar'

// export function Products() {
// 	const [searchValue, setSearchValue] = useState('')

// 	const filteredProducts = products.filter(product => {
// 		const search = searchValue.toLowerCase().trim()
// 		if (!search) return true

// 		return (
// 			product.name.toLowerCase().includes(search) ||
// 			product.price.toLowerCase().includes(search) ||
// 			product.category?.toLowerCase().includes(search) ||
// 			product.tags?.some(tag => tag.toLowerCase().includes(search))
// 		)
// 	})

// 	return (
// 		<div>
// 			{/* Топ-панель с поиском и кнопками */}
// 			<TopBar
// 				searchValue={searchValue}
// 				onSearchChange={e => setSearchValue(e.target.value)}
// 				onSort={() => console.log('Сортировка')}
// 				onFilter={() => console.log('Фильтры')}
// 			/>

// 			{/* Список товаров */}
// 			<div
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'space-between',
// 					flexWrap: 'wrap',
// 					padding: '0 10px',
// 					gap: '8px',
// 					marginTop: '8px',
// 				}}
// 			>
// 				{filteredProducts.length === 0 ? (
// 					<div
// 						style={{
// 							width: '100%',
// 							textAlign: 'center',
// 							color: '#999',
// 							padding: '20px',
// 							fontSize: '14px',
// 						}}
// 					>
// 						Ничего не найдено
// 					</div>
// 				) : (
// 					filteredProducts.map(product => (
// 						<ProductCard key={product.id} product={product} />
// 					))
// 				)}
// 			</div>
// 		</div>
// 	)
// }

// pages/Products.tsx
import { useState } from 'react'
import { products } from '../../../data/products'
import { ProductCard } from '../../ProductCard/ProductCard'
import { TopBar } from '../TopBar/TopBar'

export function Products() {
	const [searchValue, setSearchValue] = useState('')
	const [sortOption, setSortOption] = useState('name-asc')
	const [filterCategory, setFilterCategory] = useState('')

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

	// Сортировка
	const sortedProducts = [...filteredProducts].sort((a, b) => {
		switch (sortOption) {
			case 'name-asc':
				return a.name.localeCompare(b.name)
			case 'name-desc':
				return b.name.localeCompare(a.name)
			case 'price-asc':
				return parseInt(a.price) - parseInt(b.price)
			case 'price-desc':
				return parseInt(b.price) - parseInt(a.price)
			default:
				return 0
		}
	})

	return (
		<div>
			<TopBar
				searchValue={searchValue}
				onSearchChange={e => setSearchValue(e.target.value)}
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
