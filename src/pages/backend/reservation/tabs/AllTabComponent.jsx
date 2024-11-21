import React, {useEffect, useState} from 'react';
import {getGuestReservationInfo} from '../../../../api';
import ReservationCard from '../ReservationCard';

export default function AllTabComponent({restaurantId}) {
	const [restaurantInfo, setRestaurantInfo] = useState(null);

	const fetchGuestReservationInfo = async () => {
		try {
			const response = await getGuestReservationInfo(restaurantId);
			setRestaurantInfo(response);
		} catch (error) {
			console.error('Error fetching reservation info:', error);
		}
	};

	const filterAllReservations = restaurantInfo?.data?.data?.filter((item) => item.status !== 'hold');

	const handleView = (uuid) => {
		console.log('Viewing reservation:', uuid);
	};

	useEffect(() => {
		if (restaurantId) {
			fetchGuestReservationInfo();
		}
	}, [restaurantId]);

	if (!restaurantInfo) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<ReservationCard data={filterAllReservations} onHandleButton={handleView} />
		</div>
	);
}
