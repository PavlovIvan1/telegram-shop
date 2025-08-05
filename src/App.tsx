import { Route, Routes } from 'react-router-dom'
import { MobileNavbar } from './components/section/navbar'
import { Button } from './components/ui/Button/Button'
import { Favorites } from './pages/Favorites'
import { Home } from './pages/Home'

export function App() {
	return (
		<>
			{/* Основной контент */}
			<div style={{ paddingBottom: '70px', minHeight: '100vh' }}>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/search' element={<Home />} />
					<Route path='/favorites' element={<Favorites />} />
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
