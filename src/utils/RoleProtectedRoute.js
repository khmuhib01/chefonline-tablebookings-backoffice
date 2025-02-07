import React, {useContext} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {AuthContextRestaurant} from '../context/AuthContextRestaurant';

const RoleProtectedRoute = ({allowedRoles, children}) => {
	const {isAuthenticated, userType} = useContext(AuthContextRestaurant);
	const location = useLocation();

	// Check if user is authenticated and has the required role
	if (!isAuthenticated) {
		return <Navigate to="/restaurant-sign-in" replace />;
	}

	// If the user's role is not in allowedRoles, redirect to Unauthorized page
	if (!allowedRoles.includes(userType)) {
		return <Navigate to="/unauthorized" state={{from: location}} replace />;
	}

	// Allow access to the route
	return children;
};

export default RoleProtectedRoute;
