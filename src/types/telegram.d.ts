export { }

declare global {
	interface Window {
		Telegram?: {
			WebApp: {
				initDataUnsafe?: {
					query_id?: string
					user?: {
						id?: number
						first_name?: string
						[key: string]: unknown
					}
					[key: string]: unknown
				}
				themeParams: {
					bg_color?: string
					text_color?: string
					hint_color?: string
					link_color?: string
					button_color?: string
					button_text_color?: string
					secondary_bg_color?: string
					accent_text_color?: string
					section_bg_color?: string
				}
				backgroundColor?: string
				headerColor?: string
				backButtonColor?: string
					BottomBar?: { backgroundColor?: string }

					CloudStorage?: {
						getItem: (
							key: string,
							callback: (err: unknown, value?: string | null) => void
						) => void
						setItem: (
							key: string,
							value: string,
							callback: (err: unknown, ok?: boolean) => void
						) => void
						removeItem: (
							key: string,
							callback: (err: unknown, ok?: boolean) => void
						) => void
					}

				// --- Методы ---
				/**
				 * Готовит Mini App к отображению.
				 * Должен быть вызван перед любыми изменениями интерфейса.
				 */
				ready: () => void

				/**
				 * Расширяет приложение на весь экран.
				 */
				expand: () => void

				/**
				 * Закрывает Mini App.
				 */
				close: () => void

				/**
				 * Отправляет данные в бота.
				 */
				sendData: (data: string) => void

				/**
				 * Показывает попап.
				 */
				showPopup: (params: {
					title?: string
					message: string
					buttons: Array<{
						type: 'ok' | 'close' | 'cancel' | 'default' | 'destructive'
						text?: string
					}>
				}) => Promise<void>

				/**
				 * Показывает подтверждение.
				 */
				showConfirm: (message: string, callback?: (ok: boolean) => void) => void

				/**
				 * Haptic Feedback API
				 */
				HapticFeedback: {
					impactOccurred: (
						style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
					) => void
					notificationOccurred: (type: 'error' | 'success' | 'warning') => void
					selectionChanged: () => void
				}

				// --- События ---
				onEvent: (eventType: string, callback: () => void) => void
				offEvent: (eventType: string, callback: () => void) => void

				// Другие поля можно добавить по мере необходимости
			}
		}
	}
}
