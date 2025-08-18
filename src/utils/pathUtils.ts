import { pathToRegexp } from 'path-to-regexp'

/**
 * Проверяет, соответствует ли текущий путь одному из указанных паттернов
 * @param currentPath - текущий путь
 * @param patterns - массив паттернов для проверки
 * @returns true если путь соответствует хотя бы одному паттерну
 */
export function isPathActive(currentPath: string, patterns: string[]): boolean {
	return patterns.some(pattern => {
		try {
			const regexp = pathToRegexp(pattern)
			return regexp.regexp.test(currentPath)
		} catch (error) {
			// Если паттерн некорректный, используем простое сравнение
			return currentPath === pattern
		}
	})
}

/**
 * Проверяет, соответствует ли текущий путь указанному паттерну
 * @param currentPath - текущий путь
 * @param pattern - паттерн для проверки
 * @returns true если путь соответствует паттерну
 */
export function isPathMatch(currentPath: string, pattern: string): boolean {
	try {
		const regexp = pathToRegexp(pattern)
		return regexp.regexp.test(currentPath)
	} catch (error) {
		// Если паттерн некорректный, используем простое сравнение
		return currentPath === pattern
	}
}
