// src/hooks/useApi.js
import React from 'react'; // Ensure React is imported

import {useQuery, useMutation} from 'react-query';
import api from '../api';

// Example: Fetch data hook
export const useFetchData = (endpoint) => {
	return useQuery(endpoint, async () => {
		const {data} = await api.get(endpoint);
		return data;
	});
};

// Example: Post data hook
export const usePostData = (endpoint, options) => {
	return useMutation(async (newData) => {
		const {data} = await api.post(endpoint, newData);
		return data;
	}, options);
};
