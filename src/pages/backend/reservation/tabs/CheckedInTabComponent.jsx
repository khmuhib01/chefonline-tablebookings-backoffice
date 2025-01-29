import React, {useEffect, useState} from 'react';
import {People, Time} from '../../../../ui-share/Icon';
import {getCheckedOut, getGuestReservationInfo} from '../../../../api';
import {formatTime} from '../../../../utils/conversions';
import ReservationCard from '../ReservationCard';

export default function CheckedInTabComponent({restaurantId}) {
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

	const checkedInReservation = restaurantInfo?.data?.data.filter((item) => item?.status === 'check_in');

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
		console.log(' uuid', uuid);
	};

	return (
		<div>
			<ReservationCard
				data={checkedInReservation}
				handleCheckedOut={handleCheckedOut}
				handleCancel={handleCancel}
				isLoading={loading}
			/>
		</div>
	);
}
