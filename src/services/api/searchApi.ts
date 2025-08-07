// src/api/searchApi.ts

import type { Product } from '../../data/products'

interface RenderResponse {
	keyword: string
	left_products: string[] // массив ID
	right_products: string[] // массив ID
	products: Record<string, Product> // все продукты в одном объекте
}

// Основная функция поиска
export const searchProducts = async (
	query: string,
	userId: number,
	queryId: string
): Promise<RenderResponse> => {
	// Шаг 1: /handle
	const handleResponse = await fetch('/handle', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query_id: queryId,
			user_id: userId,
			search_text: query,
		}),
	})

	const handleData = await handleResponse.json()

	if (handleData.status !== 'ok') {
		throw new Error(handleData.result || 'Ошибка поиска')
	}

	// Шаг 2: /render
	const renderResponse = await fetch('/render', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			items: handleData.items,
			keyword: handleData.keyword,
		}),
	})

	const renderData = await renderResponse.json()

	return {
		keyword: renderData.keyword,
		left_products: renderData.left_products,
		right_products: renderData.right_products,
		products: renderData.products, // ← ожидаем, что бэк вернёт объект { "id1": { ... }, "id2": { ... } }
	}
}
