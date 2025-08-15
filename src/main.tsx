// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { App } from './App.tsx'
// import './index.css'

// createRoot(document.getElementById('root')!).render(
// 	<StrictMode>
// 		<App />
// 	</StrictMode>
// )

// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Создаем QueryClient с оптимизированными настройками
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Глобальные настройки для всех запросов
			staleTime: 5 * 60 * 1000, // 5 минут
			gcTime: 10 * 60 * 1000, // 10 минут
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			retry: 1, // Только одна попытка повтора
			retryDelay: 1000, // Задержка 1 секунда
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
