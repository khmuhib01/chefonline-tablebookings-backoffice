import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	guestUser: {},
	guestUserToken: null,
};

const guestUserSlice = createSlice({
	name: 'guestUser',
	initialState,
	reducers: {
		setGuestUser: (state, action) => {
			return {
				...state,
				guestUser: action.payload,
			};
		},
		setGuestUserToken: (state, action) => {
			return {
				...state,
				guestUserToken: action.payload,
			};
		},
		clearGuestUser: (state, action) => {
			return {
				...state,
				guestUser: {},
				guestUserToken: null,
			};
		},
	},
});

export const {setGuestUser, setGuestUserToken, clearGuestUser} = guestUserSlice.actions;

export default guestUserSlice.reducer;
