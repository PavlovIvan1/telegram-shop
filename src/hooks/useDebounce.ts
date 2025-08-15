import { useEffect, useState, useRef, useCallback } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

// Хук для debounce с callback
export function useDebounceCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
): T {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

	return useCallback(
		((...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args)
			}, delay)
		}) as T,
		[callback, delay]
	)
}

// Упрощенный хук для debounce поиска
export function useSearchDebounce(
	searchValue: string,
	delay: number = 300
) {
	const [debouncedSearch, setDebouncedSearch] = useState(searchValue)
	const [isSearching, setIsSearching] = useState(false)

	useEffect(() => {
		// Если значение пустое, сразу обновляем
		if (!searchValue.trim()) {
			setDebouncedSearch('')
			setIsSearching(false)
			return
		}

		// Устанавливаем флаг поиска
		setIsSearching(true)

		const handler = setTimeout(() => {
			setDebouncedSearch(searchValue)
			setIsSearching(false)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [searchValue, delay])

	return {
		debouncedSearch,
		isSearching,
		shouldSearch: searchValue.trim().length > 0,
	}
}
