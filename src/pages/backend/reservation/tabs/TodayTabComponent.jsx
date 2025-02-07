import React, {useContext, useEffect, useState} from 'react';
import {getCheckedOut, getCheckIn, getGuestReservationInfo, postReservationRemove} from '../../../../api';
import {formatDate} from '../../../../utils/conversions';
import ReservationCard from '../ReservationCard';
import {useSelector} from 'react-redux';
import Popup from '../../../../ui-share/Popup';
import {AuthContextRestaurant} from '../../../../context/AuthContextRestaurant';

export default function TodayTabComponent({restaurantId}) {
	const [restaurantInfo, setRestaurantInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupType, setPopupType] = useState(null); // "checkin", "checkout", "cancel", "view"
	const [popupMessage, setPopupMessage] = useState('');
	const [selectedReservationId, setSelectedReservationId] = useState(null);
	const [selectedReservationDetails, setSelectedReservationDetails] = useState(null);
	const [actionLoading, setActionLoading] = useState(false); // Loading only for the action button

	const storeUserId = useSelector((state) => state.user?.user.uuid);

	const {logout, userType, user} = useContext(AuthContextRestaurant);

	// console.log('userType', userType);

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
		setSelectedReservationDetails(null);
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

	// Handle viewing reservation details
	const handleView = (uuid) => {
		const reservationDetail = restaurantInfo?.data?.data.find((item) => item?.uuid === uuid);
		if (reservationDetail) {
			setSelectedReservationDetails(reservationDetail);
			setPopupType('view');
			setIsPopupOpen(true);
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
				handleView={handleView} // Opens view popup
			/>

			{/* General Popup for Check-In, Check-Out, and Cancel Actions */}
			<Popup
				isOpen={isPopupOpen && popupType !== 'view'}
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

			{/* Popup for Viewing Reservation Details */}
			<Popup
				isOpen={isPopupOpen && popupType === 'view'}
				onClose={handleClosePopup}
				title="Reservation Details"
				content={
					selectedReservationDetails ? (
						<div className="p-4 max-h-[500px] overflow-y-auto">
							{/* Guest Information Section */}
							<h3 className="text-lg font-bold mb-2">Guest Information</h3>
							<table className="w-full border-collapse border border-gray-300">
								<tbody>
									<tr>
										<td className="border p-2 font-semibold">First Name</td>
										<td className="border p-2">{selectedReservationDetails?.guest_information.first_name}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Last Name</td>
										<td className="border p-2">{selectedReservationDetails?.guest_information.last_name}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Email</td>
										<td className="border p-2">{selectedReservationDetails?.guest_information.email}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Phone</td>
										<td className="border p-2">{selectedReservationDetails?.guest_information.phone}</td>
									</tr>
								</tbody>
							</table>

							{/* Reservation Details Section */}
							<h3 className="text-lg font-bold mt-4 mb-2">Reservation Details</h3>
							<table className="w-full border-collapse border border-gray-300">
								<tbody>
									<tr>
										<td className="border p-2 font-semibold">Reservation ID</td>
										<td className="border p-2">{selectedReservationDetails?.reservation_id}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Date</td>
										<td className="border p-2">{selectedReservationDetails?.reservation_date}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Time</td>
										<td className="border p-2">{selectedReservationDetails?.reservation_time}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Guests</td>
										<td className="border p-2">{selectedReservationDetails?.number_of_people}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Status</td>
										<td className="border p-2">{selectedReservationDetails?.status}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Notes</td>
										<td className="border p-2">{selectedReservationDetails?.noted || 'No additional notes'}</td>
									</tr>
								</tbody>
							</table>

							{/* Table Information Section */}
							<h3 className="text-lg font-bold mt-4 mb-2">Table Information</h3>
							<table className="w-full border-collapse border border-gray-300">
								<tbody>
									<tr>
										<td className="border p-2 font-semibold">Table Name</td>
										<td className="border p-2">{selectedReservationDetails?.table_master?.table_name}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Capacity</td>
										<td className="border p-2">{selectedReservationDetails?.table_master?.capacity}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Min Seats</td>
										<td className="border p-2">{selectedReservationDetails?.table_master?.min_seats}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Max Seats</td>
										<td className="border p-2">{selectedReservationDetails?.table_master?.max_seats}</td>
									</tr>
									<tr>
										<td className="border p-2 font-semibold">Reservation Online</td>
										<td className="border p-2">{selectedReservationDetails?.table_master?.reservation_online}</td>
									</tr>
								</tbody>
							</table>

							{/* Restaurant Information Section */}
							{userType === 'superadmin' ? (
								<>
									<h3 className="text-lg font-bold mt-4 mb-2">Restaurant Information</h3>
									<table className="w-full border-collapse border border-gray-300">
										<tbody>
											<tr>
												<td className="border p-2 font-semibold">Restaurant Name</td>
												<td className="border p-2">{selectedReservationDetails?.restaurant?.name}</td>
											</tr>
											<tr>
												<td className="border p-2 font-semibold">Address</td>
												<td className="border p-2">{selectedReservationDetails?.restaurant?.address}</td>
											</tr>
											<tr>
												<td className="border p-2 font-semibold">Phone</td>
												<td className="border p-2">{selectedReservationDetails?.restaurant?.phone}</td>
											</tr>
											<tr>
												<td className="border p-2 font-semibold">Website</td>
												<td className="border p-2">
													<a
														href={selectedReservationDetails?.restaurant?.website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 underline"
													>
														{selectedReservationDetails?.restaurant?.website}
													</a>
												</td>
											</tr>
										</tbody>
									</table>
								</>
							) : null}

							{/* Close Button */}
							<div className="mt-4 text-center">
								<button
									className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
									onClick={handleClosePopup}
								>
									Close
								</button>
							</div>
						</div>
					) : (
						<p>Loading reservation details...</p>
					)
				}
			/>
		</div>
	);
}
