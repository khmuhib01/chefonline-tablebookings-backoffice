import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import {combineReducers} from 'redux';
import searchResultReducer from './reducers/SearchResultSlice';
import filtersReducer from './reducers/filtersSlice';
import categoryReducer from './reducers/CategorySlice';
import reservationReducer from './reducers/reservationSlice';
import userReducer from './reducers/userSlice';
import guestUserReducer from './reducers/guestUserSlice';
import restaurantDetail from './reducers/restaurantDetailSlice';

// Configuration for redux-persist
const persistConfig = {
	key: 'root', // Key for storing data in localStorage
	storage, // Default storage (localStorage)
	whitelist: ['guestUser', 'user', 'searchResult', 'category', 'reservations', 'restaurantDetails'], // List of reducers you want to persist
};

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
	searchResult: searchResultReducer,
	category: categoryReducer,
	filters: filtersReducer,
	reservations: reservationReducer,
	user: userReducer,
	guestUser: guestUserReducer,
	restaurantDetails: restaurantDetail,
});

// Apply persistReducer to the combined rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer and disable serializable checks
const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

// Create a persistor to persist the store
const persistor = persistStore(store);

// Export both the store and persistor
export {store, persistor};
