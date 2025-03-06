import axios from 'axios';
const baseURL = 'https://apiservice.tablebookings.co.uk/api/v1/';
// const baseURL = 'https://quandoo.chefonlinetest.co.uk/api/v1/';
import {getGuestToken, getToken} from './utils/storage';

const api = axios.create({
	baseURL,
	maxRedirects: 5,
});

const getRestaurantData = async (name, post_code, per_page) => {
	try {
		const {data} = await api.get(`/user/search-restaurant`, {
			params: {name, post_code, per_page},
		});
		return data;
	} catch (error) {
		console.error('Error fetching restaurant data:', error);
		throw error;
	}
};

const getRestaurantDataByPage = async (page) => {
	try {
		const {data} = await api.get(`/user/search-restaurant?page=${page}`);
		return data;
	} catch (error) {
		console.error('Error fetching restaurant data:', error);
		throw error;
	}
};

const getCategoryData = async () => {
	try {
		const {data} = await api.get('/user/category');
		return data;
	} catch (error) {
		console.error('Error fetching category data:', error);
		throw error;
	}
};

const getRestaurantDetails = async (id) => {
	try {
		const {data} = await api.get(`/user/restaurant-single-info/${id}`);
		return data;
	} catch (error) {
		console.error('Error fetching restaurant details:', error);
		throw error;
	}
};

const getRestaurantAvailableDate = async (id, date, day) => {
	try {
		const {data} = await api.get(`/user/restaurant-single-info/${id}?date=${date}&day=${day}`);
		return data;
	} catch (error) {
		console.error('Error fetching restaurant availability:', error);
		throw error;
	}
};

const getGuestReservationId = async (params, startTime, endTime, date, day, status, rest_id, people, uuid) => {
	try {
		const {data} = await api.get(
			`/user/reservation/reservation-time-hold?params=${params}&start_time=${startTime}&end_time=${endTime}&date=${date}&day=${day}&status=${status}&rest_uuid=${rest_id}&number_of_people=${people}&uuid=${uuid}`
		);
		return data;
	} catch (error) {
		console.error('Error fetching guest reservation data:', error);
		throw error;
	}
};

const postGuestRegister = async (data) => {
	try {
		const {data: response} = await api.post('/user/guest-register', data);
		return response;
	} catch (error) {
		console.error('Error registering guest:', error);
		throw error;
	}
};

const getGuestReservation = async (
	reservationUUid,
	guestId,
	status,
	restUUId,
	startTime,
	endTime,
	date,
	day,
	numberOfPeople
) => {
	try {
		const {data} = await api.get(
			`/user/reservation/reservation-book?reservation_uuid=${reservationUUid}&guest_id=${guestId}&status=${status}&rest_uuid=${restUUId}&start_time=${startTime}&end_time=${endTime}&date=${date}&day=${day}&number_of_people=${numberOfPeople}`
		);
		return data;
	} catch (error) {
		console.error('Error fetching guest reservation:', error);
		throw error;
	}
};

const getRemoveReservation = async (reservationId) => {
	try {
		const {data} = await api.get(`/user/reservation/reservation-removed?reservation_uuid=${reservationId}`);
		return data;
	} catch (error) {
		console.error('Error removing reservation:', error);
		throw error;
	}
};

const postUserLogin = async (data) => {
	try {
		const {data: response} = await api.post('/user/login', data);
		return response;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};

const postGuestLogin = async (data) => {
	try {
		const {data: response} = await api.post('/user/guest-login', data);
		return response;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};

const postUserLogout = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/logout', data, {headers});
		return response;
	} catch (error) {
		console.error('Error logging out:', error);
		throw error;
	}
};

const postGuestLogout = async (data) => {
	const token = getGuestToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/guest-logout', data, {headers});
		return response;
	} catch (error) {
		console.error('Error logging out:', error);
		throw error;
	}
};

const getReservationListByGuestId = async (guestId) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.get(`/user/reservation/reservation-info/${guestId}`, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching reservation list:', error);
		throw error;
	}
};

const getGuestReservationInfo = async (restaurantId) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=info`, {
			headers,
		});

		return data;
	} catch (error) {
		console.error('Error fetching guest reservation info:', error);
		throw error;
	}
};

const postReservationRemove = async (restaurantId, reservationId, userId) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(
			`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=cancel&uuid=${reservationId}&user_uuid=${userId}`,
			{
				headers,
			}
		);
		return data;
	} catch (error) {
		console.error('Error checking out:', error);
		throw error;
	}
};

const getCheckIn = async (restaurantId, reservationId, checkInTime) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(
			`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=checkin&checkin_time=${checkInTime}&uuid=${reservationId}`,
			{
				headers,
			}
		);
		return data;
	} catch (error) {
		console.error('Error checking in:', error);
		throw error;
	}
};

const getAccept = async (restaurantId, reservationId, userId) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(
			`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=accept&uuid=${reservationId}&user_uuid=${userId}`,
			{
				headers,
			}
		);
		return data;
	} catch (error) {
		console.error('Error checking in:', error);
		throw error;
	}
};

const getReject = async (restaurantId, reservationId, userId) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(
			`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=reject&uuid=${reservationId}&user_uuid=${userId}`,
			{
				headers,
			}
		);
		return data;
	} catch (error) {
		console.error('Error checking in:', error);
		throw error;
	}
};

const getCheckedOut = async (restaurantId, reservationId, checkedOut) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(
			`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=checkout&uuid=${reservationId}&checkout_time=${checkedOut}`,
			{
				headers,
			}
		);
		return data;
	} catch (error) {
		console.error('Error checking out:', error);
		throw error;
	}
};

// backend api

const createFloor = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/floors', data, {headers});
		return response;
	} catch (error) {
		console.error('Error creating floor:', error);
		throw error;
	}
};

const getFloorData = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const {data: response} = await api.post('/secure/restaurant/floors', data, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching floor data:', error);
		throw error;
	}
};

const postFloorDelete = async (data) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/floors', data, {headers});
		return response;
	} catch (error) {
		console.error('Error deleting floor:', error);
		throw error;
	}
};

const updateFloor = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/floors', data, {headers});
		return response;
	} catch (error) {
		console.error('Error updating floor:', error);
		throw error;
	}
};

const createTable = async (data) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/tables', data, {headers});
		return response;
	} catch (error) {
		console.error('Error creating table:', error);
		throw error;
	}
};

const getTablesData = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/tables', data, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching tables:', error);
		throw error;
	}
};

const deleteTableData = async (data) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/tables', data, {headers});
		return response;
	} catch (error) {
		console.error('Error deleting table:', error);
		throw error;
	}
};

const editTableData = async (data) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/tables', data, {headers});
		return response;
	} catch (error) {
		console.error('Error editing table:', error);
		throw error;
	}
};

const updateTable = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/tables', data, {headers});
		return response;
	} catch (error) {
		console.error('Error updating table:', error);
		throw error;
	}
};

const getRestaurantList = async () => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const response = await api.get('/secure/admin/restaurant-for-admin', {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant list:', error);
		throw error;
	}
};

const createRestaurant = async (data) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'multipart/form-data',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/admin/restaurants', data, {headers});
		return response;
	} catch (error) {
		console.error('Error creating restaurant:', error);
		throw error;
	}
};

const createRestaurantUser = async (data) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'multipart/form-data',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/users', data, {headers});
		return response;
	} catch (error) {
		console.error('Error creating restaurant:', error);
		throw error;
	}
};

const getUserList = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const response = await api.get('/secure/restaurant/users', data, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching user info:', error);
		throw error;
	}
};

const postRestaurantSearchTag = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const response = await api.post('/secure/restaurant/label-tags', data, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const getRestaurantSearchTagList = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const response = await api.post('/secure/restaurant/label-tags', data, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search tag list:', error);
		throw error;
	}
};

const restaurantAboutTag = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const response = await api.post('/secure/restaurant/about-tags', data, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const createRestaurantSlot = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const {data: response} = await api.post(
			`/secure/restaurant/slot-create-update?day=${data.day}&rest_uuid=${data.rest_uuid}&interval_time=${data.interval_time}&slot_start=${data.slot_start}&slot_end=${data.slot_end}&status=${data.status}`,
			{},
			{headers}
		);

		return response;
	} catch (error) {
		console.error('Error fetching restaurant slot:', error);
		throw error;
	}
};

const getTimeSlot = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const {data: response} = await api.get(`/secure/restaurant/slot-info/${data.rest_id}`, {
			headers,
		});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const deleteTimeSlot = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.get(`/secure/restaurant/slot-delete/${data.rest_id}/${data.day}`, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const deleteIndividualSlot = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const {data: response} = await api.get(`/secure/restaurant/slot-single-delete/${data.uuid}`, {
			headers,
		});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const getMenuCategory = async () => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.get('/secure/restaurant-function/menu-catergory', {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const createMenuItem = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		// Send POST request
		const {data: response} = await api.post('/secure/restaurant-function/menus', data, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const restaurantUserList = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant/restaurants-users', data, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching user list:', error);
		throw error;
	}
};

const restaurantGallery = async (data) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'multipart/form-data',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/restaurant-function/rest-photos', data, {headers});
		return response;
	} catch (error) {
		console.error('Error creating restaurant:', error);
		throw error;
	}
};

const restaurantMenuImageOrPdf = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'multipart/form-data',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/user/menus-photo-upload', data, {headers});
		return response;
	} catch (error) {
		console.error('Error creating restaurant:', error);
		throw error;
	}
};

const totalGuestList = async () => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const {data: response} = await api.get('/secure/admin/guest-list', {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const totalReservationList = async () => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	try {
		const {data: response} = await api.get('/secure/admin/reservation-list', {headers});
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

export {
	api,
	getRestaurantData,
	getCategoryData,
	getRestaurantDataByPage,
	getRestaurantDetails,
	getRestaurantAvailableDate,
	getGuestReservationId,
	postGuestRegister,
	getGuestReservation,
	postUserLogin,
	postUserLogout,
	postGuestLogin,
	postGuestLogout,
	getGuestReservationInfo,
	getCheckIn,
	getAccept,
	getReject,
	getCheckedOut,
	getRemoveReservation,
	getReservationListByGuestId,
	// Backend API
	createFloor,
	getFloorData,
	postFloorDelete,
	updateFloor,
	createTable,
	getTablesData,
	deleteTableData,
	editTableData,
	updateTable,
	getRestaurantList,
	createRestaurant,
	createRestaurantUser,
	getUserList,
	postRestaurantSearchTag,
	getRestaurantSearchTagList,
	restaurantAboutTag,
	createRestaurantSlot,
	getTimeSlot,
	deleteTimeSlot,
	deleteIndividualSlot,
	getMenuCategory,
	createMenuItem,
	restaurantUserList,
	restaurantGallery,
	totalGuestList,
	totalReservationList,
	restaurantMenuImageOrPdf,
	postReservationRemove,
};
