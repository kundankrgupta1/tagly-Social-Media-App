import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Accounts from '../auth/Accounts'
import Profile from '../auth/Profile'
import PrivateRoute from './PrivateRoute'
import EditProfile from '../auth/EditProfile'
import CreatePost from '../Posts/CreatePost'
import Explore from '../Posts/Explore'


// signup =>
//  /api/v1/user/auth

// profile =>
// /api/v1/user/profile/:_id


// edit profile =>
//  /api/v1/user/edit/:_id

const AllRoutes = () => {
	return (
		<div>
			<Routes>
				<Route path="/auth" element={<Accounts />} />
				<Route path="/" element={
					<PrivateRoute>
						<Home />
					</PrivateRoute>
				} />
				<Route path="/explore" element={
					<PrivateRoute>
						<Explore />
					</PrivateRoute>
				} />
				<Route path="/profile/:_id" element={
					<PrivateRoute>
						<Profile />
					</PrivateRoute>
				} />
				<Route path="/edit/:_id" element={
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