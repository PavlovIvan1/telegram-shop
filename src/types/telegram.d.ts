// src/types/telegram.d.ts

export {}

declare global {
	interface Window {
		Telegram?: {
			WebApp: {
				// Пример полей, которые могут быть
				themeParams: {
					bg_color?: string
					text_color?: string
					hint_color?: string
					link_color?: string
					button_color?: string
					button_text_color?: string
					secondary_bg_color?: string
					accent_text_color?: string
				}
				backgroundColor?: string
				HapticFeedback?: {
					impactOccurred: (
						style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
					) => void
					notificationOccurred: (type: 'error' | 'success' | 'warning') => void
					selectionChanged: () => void
				}
				// Другие методы и свойства можно добавить по необходимости
			}
		}
	}
}
