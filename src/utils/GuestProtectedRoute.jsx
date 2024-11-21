import React from 'react';
import {Navigate} from 'react-router-dom';
import {useContext} from 'react';
import {AuthContextGuest} from './../context/AuthContextGuest';

const GuestProtectedRoute = ({children, redirectTo}) => {
	const {isAuthenticated} = useContext(AuthContextGuest);

	return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

export default GuestProtectedRoute;
