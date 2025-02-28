import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PublicLayout from '@/layouts/public-layout'
import AuthLayout from '@/layouts/auth-layout'

import Homepage from '@/routes/home'
import SignInPage from '@/routes/sign-in'
import SignUpPage from '@/routes/sign-up'
import ProtectedRoutes from '@/layouts/protected-routes'
import MainLayout from '@/layouts/main-layout'
import Generate from './components/generate'
import Dashboard from './routes/dashboard'
import CreateEditPage from './routes/create-edit-page'

const App = () => {
	return (
		<Router>
			<Routes>
				{/* public routes */}
				<Route element={<PublicLayout />}>
					<Route
						index
						element={<Homepage />}
					/>
				</Route>

				{/* authentication layout */}

				<Route element={<AuthLayout />}>
					<Route
						path='/sign-in/*'
						element={<SignInPage />}
					/>
					<Route
						path='/sign-up/*'
						element={<SignUpPage />}
					/>
				</Route>
				{/* protected layout */}
				<Route
					element={
						<ProtectedRoutes>
							<MainLayout />
						</ProtectedRoutes>
					}>
					{/* all protected routes */}
					<Route
						path='/generate'
						element={<Generate />}>
						<Route
							index
							element={<Dashboard />}
						/>
						<Route
							path=':interviewId'
							element={<CreateEditPage />}
						/>
					</Route>
				</Route>
			</Routes>
		</Router>
	)
}
export default App
