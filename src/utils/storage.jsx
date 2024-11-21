// utils/storage.js

// for restaurant authentication
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');


// for guest authentication

export const getGuestToken = () => localStorage.getItem('guestToken');
export const setGuestToken = (token) => localStorage.setItem('guestToken', token);
export const clearGuestToken = () => localStorage.removeItem('guestToken');