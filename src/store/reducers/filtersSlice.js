// filtersSlice.js

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	onlineBooking: true,
	cuisine: [],
	sort: 'rating',
	// other initial states
};

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		toggleOnlineBooking: (state) => {
			state.onlineBooking = !state.onlineBooking;
		},
		setCuisine: (state, action) => {
			state.cuisine = action.payload;
		},
		setSort: (state, action) => {
			state.sort = action.payload;
		},
	},
});

export const {toggleOnlineBooking, setCuisine, setSort} = filtersSlice.actions;

export default filtersSlice.reducer;
