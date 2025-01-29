import React, {useEffect, useState} from 'react';
import {getCheckedOut, getCheckIn, getGuestReservationInfo} from '../../../../api';
import {formatDate} from '../../../../utils/conversions';
import ReservationCard from '../ReservationCard';

export default function TodayTabComponent({restaurantId}) {
	const [restaurantInfo, setRestaurantInfo] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchGuestReservationInfo = async () => {
		try {
			setLoading(true);
			const response = await getGuestReservationInfo(restaurantId);
			setLoading(false);
			setRestaurantInfo(response);
		} catch (error) {
			console.error('Error fetching reservation info:', error);
		}
	};

	const todaysReservation = restaurantInfo?.data?.data.filter(
		(item) => item?.reservation_date === formatDate(new Date())
	);


	useEffect(() => {
		if (restaurantId) {
			fetchGuestReservationInfo();
		}
	}, [restaurantId]);

	if (!restaurantInfo) {
		return <div>Loading...</div>;
	}

	const getFormattedTime = () => {
		const now = new Date();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	};

	const handleCheckedIn = async (uuid) => {
		const reservationId = uuid;
		const checkInTime = getFormattedTime();
		try {
			const response = await getCheckIn(restaurantId, reservationId, checkInTime);
			fetchGuestReservationInfo();
		} catch (error) {
			console.error('Error checking in:', error);
		}
	};

	const handleCheckedOut = async (uuid) => {
		const reservationId = uuid;
		const checkedOut = getFormattedTime();

		try {
			const response = await getCheckedOut(restaurantId, reservationId, checkedOut);
			fetchGuestReservationInfo();
		} catch (error) {
			console.error('Error checking in:', error);
		}
	};

	const handleCancel = async (uuid) => {
		console.log('Handle cancel:', uuid);
	};

	const handleView = async (uuid) => {
		setTimeout(() => {
			setLoading(true);
			setLoading(false);
		}, 2000);
	};

	const today = formatDate(new Date());

	return (
		<div>
			<ReservationCard
				data={todaysReservation}
				handleCheckedIn={handleCheckedIn}
				handleCancel={handleCancel}
				handleView={handleView}
				handleCheckedOut={handleCheckedOut}
				isLoading={loading}
			/>
		</div>
	);
}
