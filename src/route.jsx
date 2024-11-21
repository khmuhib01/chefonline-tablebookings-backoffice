// AppRoutes.js

import React from 'react';
import {Routes, Route} from 'react-router-dom';

// Layouts
import BackendLayout from './layouts/BackendLayout';

// Pages
import PageNotFound from './pages/PageNotFound';
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

const AppRoutes = () => (
	<Routes>
		{/* Authentication Routes */}
		<Route path="/" element={<RestaurantSignIn />} />
		<Route path="/restaurant-sign-in" element={<RestaurantSignIn />} />
		{/* <Route path="/restaurant-sign-in" element={<RestaurantSignIn />} /> */}
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
			<Route path="restaurant-info" element={<RestaurantInfo />} />
			<Route path="create-restaurant" element={<RestaurantCreate />} />
			<Route path="edit-restaurant/:id" element={<RestaurantEdit />} />
			<Route path="restaurant-view/:id" element={<RestaurantView />} />
			<Route path="restaurant-menu-create/:id" element={<MenuCreate />} />
			<Route path="restaurant-gallery-create/:id" element={<GalleryCreate />} />
			<Route path="restaurant-tag/:id" element={<RestaurantTag />} />
			<Route path="user-create/:id" element={<RestaurantUserCreate />} />
			<Route path="review-manage/:id" element={<ReviewManage />} />
			<Route path="*" element={<PageNotFound />} />
		</Route>

		{/* Fallback Route */}
		<Route path="*" element={<PageNotFound />} />
	</Routes>
);

export default AppRoutes;
