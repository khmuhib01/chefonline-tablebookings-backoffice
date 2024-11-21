import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	searchResult: {
		data: [],
		currentPage: 1,
		totalPages: null,
		error: null,
		loading: false,
		errorMessage: null,
	},
};

const searchResultSlice = createSlice({
	name: 'searchResult',
	initialState,
	reducers: {
		setSearchResult: (state, action) => {
			state.searchResult.data = action.payload.data || [];
			state.searchResult.currentPage = action.payload.currentPage;
			state.searchResult.totalPages = action.payload.totalPages;
			state.searchResult.error = null;
			state.searchResult.loading = false; // Ensure loading is set to false after fetching data
			state.searchResult.errorMessage = null;
		},
		setSearchResultLoading: (state) => {
			state.searchResult.loading = true;
			state.searchResult.error = null;
			state.searchResult.errorMessage = null;
		},
		setSearchResultError: (state, action) => {
			state.searchResult.loading = false;
			state.searchResult.errorMessage = action.payload.message;
		},
		setError: (state, action) => {
			state.searchResult.error = action.payload;
		},
		clearSearchResult: (state) => {
			// state.searchResult = initialState.searchResult;
			state.searchResult.loading = false;
			state.searchResult.error = null;
			state.searchResult.errorMessage = null;
			state.searchResult.totalPages = null;
			state.searchResult.data = [];
		},
	},
});

export const {setSearchResult, setSearchResultLoading, setSearchResultError, setError, clearSearchResult} =
	searchResultSlice.actions;

export default searchResultSlice.reducer;
