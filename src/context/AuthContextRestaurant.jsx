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
				return JSON.parse(item);
			} catch (error) {
				return null;
			}
		};

		// Check if user is authenticated by looking for a token in localStorage
		const storedUser = safeJsonParse(localStorage.getItem('user'));
		const storedUserType = localStorage.getItem('userType');
		const storedUserToken = localStorage.getItem('userToken');

		if (storedUser && storedUserType && storedUserToken) {
			setIsAuthenticated(true);
			setUser(storedUser);
			setUserType(storedUserType);
			setUserToken(storedUserToken);
		}

		setLoading(false); // Set loading to false after check is done
	}, []);

	const login = (userData, type) => {
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
				uuid: user?.uuid,
				token: userToken,
			};

			// If UUID is present, perform guest logout
			if (data?.uuid) {
				const response = await postUserLogout(data);
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
