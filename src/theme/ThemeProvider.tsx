import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ThemeName } from '../constants/colors'

interface ThemeContextValue {
	theme: ThemeName
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<ThemeName>(() => {
		const saved = localStorage.getItem('theme') as ThemeName | null
		return saved ?? 'light'
	})

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	const value = useMemo(
		() => ({
			theme,
			toggleTheme: () => setTheme(prev => (prev === 'light' ? 'dark' : 'light')),
		}),
		[theme],
	)

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}


