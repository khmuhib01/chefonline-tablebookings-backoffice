import React, {useContext} from 'react';
import {Routes, Route} from 'react-router-dom';

// Layouts
import BackendLayout from './layouts/BackendLayout';

// Pages
import PageNotFound from './pages/PageNotFound';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/backend/Dashboard/Dashboard';

// Backend Pages
import ReservationPage from './pages/backend/reservation/ReservationPage';
import CapacityPage from './pages/backend/capacity/CapacityPage';
import AvailabilityPage from './pages/backend/availability/AvailabilityPage';
import RestaurantInfo from './pages/backend/restaurant/RestaurantList';
import RestaurantCreate from './pages/backend/restaurant/RestaurantCreate';
import RestaurantEdit from './pages/backend/restaurant/RestaurantEdit';
import RestaurantView from './pages/backend/restaurant/RestaurantView';
import MenuCreate from './pages/backend/restaurant/MenuCreate';
import GalleryCreate from './pages/backend/restaurant/GalleryCreate';
import RestaurantTag from './pages/backend/restaurant/RestaurantTag';
import ReviewManage from './pages/backend/review/ReviewManage';
import RestaurantUserCreate from './pages/backend/user/RestaurantUserCreate';

// Auth Pages
import RestaurantSignIn from './pages/backend/RestaurantSignIn';
import RestaurantSignUp from './pages/backend/RestaurantSignUp';

// Route Guards
import RestaurantProtectedRoutes from './utils/RestaurantProtectedRoutes';
import RoleProtectedRoute from './utils/RoleProtectedRoute';
import {AuthContextRestaurant} from './context/AuthContextRestaurant';

const AppRoutes = () => {
	const {isAuthenticated, userType} = useContext(AuthContextRestaurant);

	return (
		<Routes>
			{/* Authentication Routes */}
			<Route path="/" element={<RestaurantSignIn />} />
			<Route path="/restaurant-sign-in" element={<RestaurantSignIn />} />
			<Route path="/restaurant-sign-up" element={<RestaurantSignUp />} />

			{/* Protected Backend Routes */}
			<Route
				path="/dashboard/*"
				element={
					<RestaurantProtectedRoutes redirectTo="/restaurant-sign-in">
						<BackendLayout />
					</RestaurantProtectedRoutes>
				}
			>
				<Route index element={<Dashboard />} />
				<Route path="capacity/:id" element={<CapacityPage />} />
				<Route path="reservation/:id" element={<ReservationPage />} />
				<Route path="availability/:id" element={<AvailabilityPage />} />

				{/* 🚀 RESTRICTED: Only Super Admin can access this */}
				<Route
					path="restaurant-info"
					element={
						<RoleProtectedRoute allowedRoles={['super_admin']}>
							<RestaurantInfo />
						</RoleProtectedRoute>
					}
				/>

				<Route
					path="create-restaurant"
					element={
						<RoleProtectedRoute allowedRoles={['super_admin']}>
							<RestaurantCreate />
						</RoleProtectedRoute>
					}
				/>
				<Route
					path="edit-restaurant/:id"
					element={
						<RoleProtectedRoute allowedRoles={['super_admin']}>
							<RestaurantEdit />
						</RoleProtectedRoute>
					}
				/>
				<Route
					path="restaurant-view/:id"
					element={
						<RoleProtectedRoute allowedRoles={['super_admin']}>
							<RestaurantView />
						</RoleProtectedRoute>
					}
				/>
				<Route
					path="restaurant-menu-create/:id"
					element={
						<RoleProtectedRoute allowedRoles={['super_admin']}>
							<MenuCreate />
						</RoleProtectedRoute>
					}
				/>
				<Route
					path="restaurant-gallery-create/:id"
					element={
						<RoleProtectedRoute allowedRoles={['super_admin']}>
							<GalleryCreate />
						</RoleProtectedRoute>
					}
				/>
				<Route
					path="restaurant-tag/:id"
					element={
						<RoleProtectedRoute allowedRoles={['super_admin']}>
							<RestaurantTag />
						</RoleProtectedRoute>
					}
				/>

				{/* 🚀 RESTRICTED: Only Super Admin can access this */}
				<Route
					path="user-create/:id"
					element={
						<RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
							<RestaurantUserCreate />
						</RoleProtectedRoute>
					}
				/>

				<Route path="review-manage/:id" element={<ReviewManage />} />
				<Route path="*" element={<PageNotFound />} />
			</Route>

			{/* Unauthorized Access Page */}
			<Route path="/unauthorized" element={<Unauthorized />} />

			{/* Catch-All Fallback Route */}
			<Route path="*" element={<PageNotFound />} />
		</Routes>
	);
};

export default AppRoutes;
