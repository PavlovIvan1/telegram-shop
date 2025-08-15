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
	const timeoutRef = useRef<NodeJS.Timeout>()

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

// Хук для debounce поиска с минимальной длиной
export function useSearchDebounce(
	searchValue: string,
	delay: number = 300,
	minLength: number = 2
) {
	const [debouncedSearch, setDebouncedSearch] = useState('')
	const [isSearching, setIsSearching] = useState(false)

	useEffect(() => {
		const handler = setTimeout(() => {
			if (searchValue.length >= minLength) {
				setDebouncedSearch(searchValue)
				setIsSearching(true)
			} else {
				setDebouncedSearch('')
				setIsSearching(false)
			}
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [searchValue, delay, minLength])

	return {
		debouncedSearch,
		isSearching,
		shouldSearch: searchValue.length >= minLength,
	}
}
