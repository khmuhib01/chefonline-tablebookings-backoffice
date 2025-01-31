import React, {useEffect, useState} from 'react';
import {getCheckedOut, getCheckIn, getGuestReservationInfo, postReservationRemove} from '../../../../api';
import {formatDate} from '../../../../utils/conversions';
import ReservationCard from '../ReservationCard';
import {useSelector} from 'react-redux';
import Popup from '../../../../ui-share/Popup';

export default function TodayTabComponent({restaurantId}) {
	const [restaurantInfo, setRestaurantInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');
	const [selectedReservationId, setSelectedReservationId] = useState(null);

	const storeRestaurantDetails = useSelector((state) => state.restaurantDetails?.restaurantDetails?.data);
	const storeUserId = useSelector((state) => state.user?.user.uuid);

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
			await getCheckIn(restaurantId, reservationId, checkInTime);
			fetchGuestReservationInfo();
		} catch (error) {
			console.error('Error checking in:', error);
		}
	};

	const handleCheckedOut = async (uuid) => {
		const reservationId = uuid;
		const checkedOut = getFormattedTime();

		try {
			await getCheckedOut(restaurantId, reservationId, checkedOut);
			fetchGuestReservationInfo();
		} catch (error) {
			console.error('Error checking out:', error);
		}
	};

	// Open confirmation popup before canceling
	const handleCancel = (uuid) => {
		setSelectedReservationId(uuid);
		setPopupMessage('Are you sure you want to cancel this reservation?');
		setIsPopupOpen(true);
	};

	// Close the cancel confirmation popup
	const handleClosePopup = () => {
		setIsPopupOpen(false);
		setSelectedReservationId(null);
	};

	// Confirm and cancel the reservation
	const handleConfirmCancel = async () => {
		if (!selectedReservationId) return;

		try {
			setLoading(true);
			await postReservationRemove(restaurantId, selectedReservationId, storeUserId);
			setLoading(false);
			fetchGuestReservationInfo();
		} catch (error) {
			console.error('Error removing reservation:', error);
		} finally {
			handleClosePopup(); // Close the popup after cancellation
		}
	};

	const handleView = async (uuid) => {
		setTimeout(() => {
			setLoading(true);
			setLoading(false);
		}, 2000);
	};

	return (
		<div>
			<ReservationCard
				data={todaysReservation}
				handleCheckedIn={handleCheckedIn}
				handleCancel={handleCancel} // Opens the confirmation popup
				handleView={handleView}
				handleCheckedOut={handleCheckedOut}
				isLoading={loading}
			/>

			{/* Cancel Confirmation Popup */}
			<Popup
				isOpen={isPopupOpen}
				onClose={handleClosePopup}
				title="Cancel Reservation"
				content={
					<div className="text-center">
						<p className="text-gray-700">{popupMessage}</p>
						<div className="mt-4 flex justify-center gap-4">
							<button
								className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
								onClick={handleConfirmCancel}
							>
								{loading ? 'Loading...' : 'Yes, Cancel'}
							</button>
							<button
								className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
								onClick={handleClosePopup}
							>
								{loading ? 'Loading...' : 'No, Keep It'}
							</button>
						</div>
					</div>
				}
			/>
		</div>
	);
}
