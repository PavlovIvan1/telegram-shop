import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

interface ApiConfig {
	url: string
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
	body?: any
	headers?: Record<string, string>
	enabled?: boolean
	staleTime?: number
	gcTime?: number
}

// Функция для параллельной загрузки нескольких API запросов
export async function parallelApiRequests<T extends Record<string, ApiConfig>>(
	configs: T
): Promise<{ [K in keyof T]: any }> {
	const promises = Object.entries(configs).map(async ([key, config]) => {
		try {
			const response = await fetch(config.url, {
				method: config.method || 'GET',
				headers: {
					'Content-Type': 'application/json',
					...config.headers,
				},
				body: config.body ? JSON.stringify(config.body) : undefined,
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return [key, data]
		} catch (error) {
			console.error(`Error in API request ${key}:`, error)
			return [key, null]
		}
	})

	const results = await Promise.all(promises)
	return Object.fromEntries(results) as { [K in keyof T]: any }
}

// Хук для оптимизированной загрузки продуктов
export function useOptimizedProducts(searchText: string) {
	return useQuery({
		queryKey: ['optimized-products', searchText],
		queryFn: async () => {
			// Параллельно загружаем оба API запроса
			const results = await parallelApiRequests({
				handle: {
					url: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/handle`,
					method: 'POST',
					body: {
						query_id: window.Telegram?.WebApp?.initDataUnsafe?.query_id,
						user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
						search_text: searchText || 'айфон',
					},
				},
				render: {
					url: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/render`,
					method: 'POST',
					body: {
						items: [], // Будет заполнено после получения handle
					},
				},
			})

			// Если handle успешен, обновляем render запрос
			if (results.handle?.status === 'ok') {
				const renderResponse = await fetch(
					`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/render`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							items: results.handle.items,
							keyword: results.handle.keyword,
						}),
					}
				)

				const renderData = await renderResponse.json()
				results.render = renderData
			}

			return results
		},
		enabled: !!searchText,
		staleTime: 5 * 60 * 1000, // 5 минут
		gcTime: 10 * 60 * 1000, // 10 минут
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
		retryDelay: 1000,
	})
}

// Хук для предзагрузки данных
export function usePrefetchProducts(searchText: string) {
	const queryClient = useQueryClient()
	
	return useCallback(() => {
		queryClient.prefetchQuery({
			queryKey: ['optimized-products', searchText],
			queryFn: async () => {
				// Логика предзагрузки
			},
			staleTime: 5 * 60 * 1000,
		})
	}, [queryClient, searchText])
}
