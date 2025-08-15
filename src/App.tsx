import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MobileNavbar } from './components/section/navbar'
import { Button } from './components/ui/Button/Button'
import { Favorites } from './pages/Favorites'
import { Home } from './pages/Home'
import { ProductPage } from './pages/ProductPage'

export function App() {
	useEffect(() => {
		// 🚀 Убедимся, что Telegram WebApp готов к навигации
		if (window.Telegram?.WebApp) {
			window.Telegram.WebApp.ready()
			console.log('Telegram WebApp.ready() вызван')
		}
	}, [])

	return (
		<>
			{/* Основной контент */}
			<div style={{ paddingBottom: '70px', minHeight: '100vh' }}>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/search' element={<Home />} />
					<Route path='/favorites' element={<Favorites />} />
					<Route path='/product/:id' element={<ProductPage />} />
				</Routes>
			</div>

			{/* Фиксированный навбар — всегда виден */}
			<MobileNavbar />

			{/* Пример кнопки */}
			<div style={{ padding: '20px', textAlign: 'center' }}>
				<Button w={'100px'} h={'30px'}>
					Hello
				</Button>
			</div>
		</>
	)
}

// Добавляем default export
export default App
