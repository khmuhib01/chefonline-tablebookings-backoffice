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
	const [popupType, setPopupType] = useState(null); // "checkin", "checkout", "cancel"
	const [popupMessage, setPopupMessage] = useState('');
	const [selectedReservationId, setSelectedReservationId] = useState(null);
	const [actionLoading, setActionLoading] = useState(false); // Loading only for the action button

	const storeUserId = useSelector((state) => state.user?.user.uuid);

	const fetchGuestReservationInfo = async () => {
		try {
			setLoading(true);
			const response = await getGuestReservationInfo(restaurantId);
			setRestaurantInfo(response);
		} catch (error) {
			console.error('Error fetching reservation info:', error);
		} finally {
			setLoading(false);
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

	// Open popup before performing an action
	const openPopup = (uuid, type) => {
		setSelectedReservationId(uuid);
		setPopupType(type);
		if (type === 'checkin') setPopupMessage('Are you sure you want to check in this reservation?');
		if (type === 'checkout') setPopupMessage('Are you sure you want to check out this reservation?');
		if (type === 'cancel') setPopupMessage('Are you sure you want to cancel this reservation?');
		setIsPopupOpen(true);
	};

	// Close popup
	const handleClosePopup = () => {
		setIsPopupOpen(false);
		setPopupType(null);
		setSelectedReservationId(null);
		setActionLoading(false);
	};

	// Confirm action based on popupType
	const handleConfirmAction = async () => {
		if (!selectedReservationId || !popupType) return;

		setActionLoading(true);
		try {
			if (popupType === 'checkin') {
				await getCheckIn(restaurantId, selectedReservationId, getFormattedTime());
			} else if (popupType === 'checkout') {
				await getCheckedOut(restaurantId, selectedReservationId, getFormattedTime());
			} else if (popupType === 'cancel') {
				await postReservationRemove(restaurantId, selectedReservationId, storeUserId);
			}
			fetchGuestReservationInfo();
		} catch (error) {
			console.error(`Error during ${popupType}:`, error);
		} finally {
			handleClosePopup(); // Close the popup after action
		}
	};

	return (
		<div>
			<ReservationCard
				data={todaysReservation}
				handleCheckedIn={(uuid) => openPopup(uuid, 'checkin')} // Opens check-in popup
				handleCheckedOut={(uuid) => openPopup(uuid, 'checkout')} // Opens check-out popup
				handleCancel={(uuid) => openPopup(uuid, 'cancel')} // Opens cancel popup
				isLoading={loading}
			/>

			{/* General Popup for Check-In, Check-Out, and Cancel Actions */}
			<Popup
				isOpen={isPopupOpen}
				onClose={handleClosePopup}
				title={
					popupType === 'checkin'
						? 'Check-In Confirmation'
						: popupType === 'checkout'
						? 'Check-Out Confirmation'
						: 'Cancel Reservation'
				}
				content={
					<div className="text-center">
						<p className="text-gray-700">{popupMessage}</p>
						<div className="mt-4 flex justify-center gap-4">
							<button
								className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
								onClick={handleConfirmAction}
								disabled={actionLoading}
							>
								{actionLoading ? 'Processing...' : 'Yes, Confirm'}
							</button>
							<button
								className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
								onClick={handleClosePopup}
								disabled={actionLoading} // Prevent interaction during loading
							>
								No, Keep It
							</button>
						</div>
					</div>
				}
			/>
		</div>
	);
}
