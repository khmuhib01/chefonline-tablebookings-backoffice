import {createSlice} from '@reduxjs/toolkit';
import {getToken, setToken, clearToken} from '../../utils/storage';

const initialState = {
	token: getToken(),
	user: {},
};

const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAuthToken: (state, action) => {
			state.token = action.payload;
			setToken(action.payload);
		},
		clearAuthToken: (state) => {
			state.token = null;
			clearToken();
		},
		setUser: (state, action) => {
			state.user = action.payload;
		},
		clearUser: (state) => {
			state.user = {};
		},
	},
});

export const {setUser, setAuthToken, clearUser, clearAuthToken} = UserSlice.actions;

export default UserSlice.reducer;
