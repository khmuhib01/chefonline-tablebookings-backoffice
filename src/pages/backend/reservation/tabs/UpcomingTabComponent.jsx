import React, {useEffect, useState} from 'react';
import {People, Time} from '../../../../ui-share/Icon';
import {getGuestReservationInfo} from '../../../../api';
import {formatDate, formatTime} from '../../../../utils/conversions';
import ReservationCard from '../ReservationCard';

export default function UpcomingTabComponent({restaurantId}) {
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

	useEffect(() => {
		if (restaurantId) {
			fetchGuestReservationInfo();
		}
	}, [restaurantId]);

	if (!restaurantInfo) {
		return <div>Loading...</div>;
	}

	// Utility function to check if a date is in the future
	const isFutureDate = (dateStr) => {
		const [day, month, year] = dateStr.split('/');
		const reservationDate = new Date(`${year}-${month}-${day}`);
		const today = new Date();
		return reservationDate > today;
	};

	const handleView = (uuid) => {
		// console.log(' uuid', uuid);
	};

	const upcomingReservations = restaurantInfo?.data?.data.filter((item) => isFutureDate(item?.reservation_date));

	return (
		<div>
			{upcomingReservations.length > 0 ? (
				<ReservationCard data={upcomingReservations} handleView={handleView} isLoading={loading} />
			) : (
				<div className="text-titleText font-bold">No Data Found</div>
			)}
		</div>
	);
}
