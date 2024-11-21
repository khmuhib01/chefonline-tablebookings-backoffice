import React, {useEffect, useState} from 'react';
import {getCheckedOut, getGuestReservationInfo} from '../../../../api';
import ReservationCard from './../ReservationCard';

export default function CheckedOutTabComponent({restaurantId}) {
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

	const checkedOutReservation = restaurantInfo?.data?.data.filter((item) => item?.status === 'completed');

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

	const handleView = (uuid) => {
		console.log(uuid);
	};

	return (
		<div>
			<ReservationCard data={checkedOutReservation} handleView={handleView} isLoading={loading} />
		</div>
	);
}
