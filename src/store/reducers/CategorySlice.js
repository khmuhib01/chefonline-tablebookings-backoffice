// CategorySlice.js

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	categories: [], // Initial state for categories
	error: null, // Initial error state
	loading: false, // Initial loading state
};

const CategorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {
		setCategories: (state, action) => {
			state.categories = action.payload;
			state.loading = false;
			state.error = null;
		},
		setCategoriesLoading: (state) => {
			state.loading = true;
			state.error = null;
		},
		setCategoriesError: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const {setCategories, setCategoriesLoading, setCategoriesError} = CategorySlice.actions;

export default CategorySlice.reducer;
