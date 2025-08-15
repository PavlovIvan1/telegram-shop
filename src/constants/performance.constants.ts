// Константы для оптимизации производительности

// Время кэширования данных (в миллисекундах)
export const CACHE_TIMES = {
	PRODUCTS: 5 * 60 * 1000, // 5 минут
	PRODUCT: 10 * 60 * 1000, // 10 минут
	IMAGES: 30 * 60 * 1000, // 30 минут
	USER_DATA: 60 * 60 * 1000, // 1 час
} as const

// Настройки для React Query
export const QUERY_CONFIG = {
	DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 минут
	DEFAULT_GC_TIME: 10 * 60 * 1000, // 10 минут
	MAX_RETRIES: 1,
	RETRY_DELAY: 1000, // 1 секунда
	REFETCH_ON_WINDOW_FOCUS: false,
	REFETCH_ON_MOUNT: false,
} as const

// Настройки для изображений
export const IMAGE_CONFIG = {
	LAZY_LOADING: true,
	PRELOAD_FIRST: true,
	PRELOAD_DELAY: 100, // 100ms между загрузкой изображений
	PLACEHOLDER_BLUR: '1px',
	TRANSITION_DURATION: 300, // 300ms для анимации
} as const

// Настройки для API запросов
export const API_CONFIG = {
	PARALLEL_REQUESTS: true,
	REQUEST_TIMEOUT: 10000, // 10 секунд
	BATCH_SIZE: 10, // Размер пакета для загрузки
	DEBOUNCE_DELAY: 300, // 300ms для debounce поиска
} as const

// Настройки для виртуализации
export const VIRTUALIZATION_CONFIG = {
	ITEM_HEIGHT: 200, // Высота элемента в пикселях
	OVERSCAN: 5, // Количество элементов для предзагрузки
	BUFFER_SIZE: 10, // Размер буфера
} as const

// Настройки для Intersection Observer
export const INTERSECTION_CONFIG = {
	ROOT_MARGIN: '50px',
	THRESHOLD: 0.1,
} as const
