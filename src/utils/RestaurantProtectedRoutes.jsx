import React from 'react';
import {Navigate} from 'react-router-dom';
import {useContext} from 'react';
import {AuthContextRestaurant} from './../context/AuthContextRestaurant';

export default function RestaurantProtectedRoutes({children, redirectTo}) {
	const {isAuthenticated, loading} = useContext(AuthContextRestaurant);

	if (loading) {
		// Optionally, render a loading spinner or some placeholder
		return <div>Loading...</div>;
	}

	return isAuthenticated ? children : <Navigate to={redirectTo} />;
}
