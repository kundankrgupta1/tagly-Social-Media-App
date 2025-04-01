import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Accounts from '../auth/Accounts'
import Profile from '../auth/Profile'
import PrivateRoute from './PrivateRoute'
import EditProfile from '../auth/EditProfile'
import CreatePost from '../Posts/CreatePost'
const AllRoutes = () => {
	return (
		<div>
			<Routes>
				<Route path="/api/v1/user/auth" element={<Accounts />} />
				<Route path="/" element={
					<PrivateRoute>
						<Home />
					</PrivateRoute>
				} />
				<Route path="/api/v1/user/profile/:_id" element={
					<PrivateRoute>
						<Profile />
					</PrivateRoute>
				} />
				<Route path="/api/v1/user/edit/:_id" element={
					<PrivateRoute>
						<EditProfile />
					</PrivateRoute>
				} />
				<Route path="/create" element={
					<PrivateRoute>
						<CreatePost />
					</PrivateRoute>
				} />
			</Routes>
		</div>
	)
}

export default AllRoutes;