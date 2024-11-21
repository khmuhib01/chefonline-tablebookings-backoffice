import React from 'react';
import {Navigate} from 'react-router-dom';

const ThankYouRoute = ({children}) => {
	const registrationStatus = localStorage.getItem('reservationComplete');

	return registrationStatus === 'completed' ? children : <Navigate to="/" />;
};

export default ThankYouRoute;
