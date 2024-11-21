import React from 'react';
import {Navigate} from 'react-router-dom';

const RegistrationSuccessRoute = ({children}) => {
	const registrationStatus = localStorage.getItem('registrationStatus');

	return registrationStatus === 'completed' ? children : <Navigate to="/sign-up" />;
};

export default RegistrationSuccessRoute;
