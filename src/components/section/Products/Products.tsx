import { ProductCard } from '../../ProductCard/ProductCard'

export function Products() {
	return (
		<>
			<div
				style={{
					display: 'flex',
					// gap: '10px',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					padding: '10px',
				}}
			>
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
			</div>
		</>
	)
}
