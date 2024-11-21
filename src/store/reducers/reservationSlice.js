import {createSlice} from '@reduxjs/toolkit';
import {formatDateAndDay} from '../../utils/conversions';

const initialState = {
	reservations: [],
	currentReservation: {
		person: 1, // Assuming 1 is a more sensible default for your app
		date: formatDateAndDay(new Date()).formattedDate,
		day: formatDateAndDay(new Date()).dayOfWeek,
		time: null,
		start_time: null,
		end_time: null,
		res_id: null,
		rest_name: null,
		reservation_id: null,
		reservation_uuid: null,
		reservation_message: null,
		user_id: null,
		user_name: null,
		user_email: null,
	},
};

const reservationSlice = createSlice({
	name: 'reservations',
	initialState,
	reducers: {
		setPerson: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					person: action.payload,
				},
			};
		},
		setDate: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					date: action.payload,
				},
			};
		},
		setDay: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					day: action.payload,
				},
			};
		},
		setStartTime: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					start_time: action.payload,
				},
			};
		},
		setEndTime: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					end_time: action.payload,
				},
			};
		},
		setResId: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					res_id: action.payload,
				},
			};
		},
		setTime: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					time: action.payload,
				},
			};
		},
		setReservationId: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					reservation_id: action.payload,
				},
			};
		},

		setReservationUUID: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					reservation_uuid: action.payload,
				},
			};
		},
		setUserID: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					user_id: action.payload,
				},
			};
		},
		setUserName: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					user_name: action.payload,
				},
			};
		},
		setUserEmail: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					user_email: action.payload,
				},
			};
		},
		setResName: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					rest_name: action.payload,
				},
			};
		},
		setReservation_message: (state, action) => {
			return {
				...state,
				currentReservation: {
					...state.currentReservation,
					reservation_message: action.payload,
				},
			};
		},
		addReservation: (state, action) => {
			return {
				...state,
				reservations: [...state.reservations, action.payload],
			};
		},
		clearCurrentReservation: (state) => {
			return {
				...state,
				currentReservation: {
					person: 1,
					date: formatDateAndDay(new Date()).formattedDate,
					day: formatDateAndDay(new Date()).dayOfWeek,
					time: null,
					start_time: null,
					end_time: null,
					res_id: null,
					reservation_id: null,
					reservation_message: null,
					user_id: null,
					user_name: null,
					user_email: null,
					rest_name: null,
				},
			};
		},
	},
});

export const {
	setPerson,
	setDate,
	setDay,
	setStartTime,
	setEndTime,
	setResId,
	setTime,
	addReservation,
	setReservationId,
	setReservationUUID,
	setReservation_message,
	setUserID,
	setUserName,
	setUserEmail,
	setResName,
	clearCurrentReservation,
} = reservationSlice.actions;

export default reservationSlice.reducer;
