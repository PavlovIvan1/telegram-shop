// import { ProductCard } from '../../ProductCard/ProductCard'

// export function Products() {
// 	return (
// 		<>
// 			<div
// style={{
// 	display: 'flex',
// 	// gap: '4px',
// 	justifyContent: 'space-between',
// 	flexWrap: 'wrap',
// 	padding: '10px',
// }}
// 			>
// 				<ProductCard />
// 				<ProductCard />
// 				<ProductCard />
// 				<ProductCard />
// 			</div>
// 		</>
// 	)
// }

// pages/Products.tsx
import { products } from '../../../data/products'
import { ProductCard } from '../../ProductCard/ProductCard'

export function Products() {
	return (
		<div
			style={{
				display: 'flex',
				// gap: '4px',
				justifyContent: 'space-between',
				flexWrap: 'wrap',
				padding: '10px',
			}}
		>
			{products.map(product => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	)
}
