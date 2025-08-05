import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MobileNavbar } from './components/section/navbar'
import { Button } from './components/ui/Button/Button'
import { Favorites } from './pages/Favorites'
import { Home } from './pages/Home'

export function App() {
	return (
		<>
			<BrowserRouter>
				<div style={{ paddingBottom: '70px', minHeight: '100vh' }}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/search' element={<Home />} />
						<Route path='/favorites' element={<Favorites />} />
					</Routes>
				</div>

				<MobileNavbar />
			</BrowserRouter>
			<div>
				<Button w={'100px'} h={'30px'}>
					Hello
				</Button>
			</div>
		</>
	)
}
