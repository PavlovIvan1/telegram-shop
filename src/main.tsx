import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './index.css'

// Создаем QueryClient с настройками кэширования
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Время жизни кэша - 5 минут
			staleTime: 5 * 60 * 1000,
			// Время хранения в памяти - 10 минут
			gcTime: 10 * 60 * 1000,
			// Не перезагружаем при фокусе окна
			refetchOnWindowFocus: false,
			// Не перезагружаем при монтировании компонента
			refetchOnMount: false,
			// Количество попыток повтора при ошибке
			retry: 1,
			// Задержка между попытками
			retryDelay: 1000,
		},
		mutations: {
			retry: 1,
			retryDelay: 1000,
		},
	},
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>,
)
