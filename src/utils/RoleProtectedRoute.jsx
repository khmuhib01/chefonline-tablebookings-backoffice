import React, {useContext} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {AuthContextRestaurant} from '../context/AuthContextRestaurant';

const RoleProtectedRoute = ({allowedRoles = [], children}) => {
	const {isAuthenticated, userType} = useContext(AuthContextRestaurant);
	const location = useLocation();

	if (!Array.isArray(allowedRoles)) {
		console.error('allowedRoles must be an array, received:', allowedRoles);
		return <Navigate to="/unauthorized" state={{from: location}} replace />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/restaurant-sign-in" replace />;
	}

	if (!allowedRoles.includes(userType)) {
		return <Navigate to="/unauthorized" state={{from: location}} replace />;
	}

	return children;
};

export default RoleProtectedRoute;
