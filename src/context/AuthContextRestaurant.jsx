import React, {createContext, useState, useEffect} from 'react';
import {postUserLogout} from '../api';

export const AuthContextRestaurant = createContext();

const AuthProviderRestaurant = ({children}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [userType, setUserType] = useState(null); // 'guest' or 'restaurant'
	const [userToken, setUserToken] = useState(null);
	const [loading, setLoading] = useState(true); // Loading state

	useEffect(() => {
		// Helper function to safely parse JSON
		const safeJsonParse = (item) => {
			try {
				return item ? JSON.parse(item) : null;
			} catch (error) {
				console.error('Error parsing JSON from localStorage:', error);
				return null;
			}
		};

		// Retrieve authentication details from localStorage
		const storedUser = safeJsonParse(localStorage.getItem('user'));
		const storedUserType = localStorage.getItem('userType') || null;
		const storedUserToken = localStorage.getItem('userToken') || null;

		if (storedUser && storedUserType && storedUserToken) {
			setIsAuthenticated(true);
			setUser(storedUser);
			setUserType(storedUserType);
			setUserToken(storedUserToken);
		}

		setLoading(false); // Set loading to false after the check
	}, []);

	const login = (userData, type) => {
		if (!userData || !userData.data || !userData.token) {
			console.error('Invalid user data received during login:', userData);
			return;
		}

		setIsAuthenticated(true);
		setUser(userData.data);
		setUserType(type);
		setUserToken(userData.token);

		localStorage.setItem('user', JSON.stringify(userData.data));
		localStorage.setItem('userType', type);
		localStorage.setItem('userToken', userData.token);
	};

	const logout = async () => {
		try {
			// Prepare data for guest logout
			const data = {
				uuid: user?.uuid || null,
				token: userToken || null,
			};

			// Call logout API only if UUID and token are available
			if (data.uuid && data.token) {
				await postUserLogout(data);
			}

			// Clear authentication data
			setIsAuthenticated(false);
			setUser(null);
			setUserType(null);
			setUserToken(null);

			// Clear localStorage
			localStorage.removeItem('user');
			localStorage.removeItem('userType');
			localStorage.removeItem('userToken');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<AuthContextRestaurant.Provider value={{isAuthenticated, user, userType, userToken, login, logout, loading}}>
			{children}
		</AuthContextRestaurant.Provider>
	);
};

export default AuthProviderRestaurant;
