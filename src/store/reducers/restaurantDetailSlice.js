import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	restaurantDetails: {},
};

const restaurantDetailSlice = createSlice({
	name: 'restaurantDetails',
	initialState,
	reducers: {
		setRestaurantDetails: (state, action) => {
			state.restaurantDetails = action.payload;
		},
	},
});

export const {setRestaurantDetails} = restaurantDetailSlice.actions;

export default restaurantDetailSlice.reducer;
