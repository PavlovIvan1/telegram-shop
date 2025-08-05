import { ProductCard } from '../../ProductCard/ProductCard'

export function Products() {
	return (
		<>
			<div style={{ display: 'flex', gap: '10px' }}>
				<ProductCard />
				<ProductCard />
			</div>
		</>
	)
}
