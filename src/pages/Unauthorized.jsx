import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

const Unauthorized = () => {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div className="h-screen flex flex-col items-center justify-center bg-gray-100">
			<h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
			<p className="text-gray-700 mt-2">You do not have permission to access this page.</p>
			<p className="text-sm text-gray-500">Requested URL: {location.pathname}</p>
			<button
				className="mt-4 bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
				onClick={() => navigate('/dashboard')}
			>
				Go to Dashboard
			</button>
		</div>
	);
};

export default Unauthorized;
