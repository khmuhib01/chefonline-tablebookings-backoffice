import React, {useContext, useEffect, useState} from 'react';
import {People, Time} from '../../../../ui-share/Icon';
import {getCheckedOut, getGuestReservationInfo} from '../../../../api';
import {formatTime} from '../../../../utils/conversions';
import ReservationCard from '../ReservationCard';
import Popup from '../../../../ui-share/Popup'; // Ensure Popup component is correctly imported
import {AuthContextRestaurant} from '../../../../context/AuthContextRestaurant';

export default function CheckedInTabComponent({restaurantId}) {
	const [restaurantInfo, setRestaurantInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupType, setPopupType] = useState(null);
	const [selectedReservationDetails, setSelectedReservationDetails] = useState(null);

	const {logout, userType, user} = useContext(AuthContextRestaurant);

	// Fetch Checked-In Reservations
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

	// Filter checked-in reservations
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

	// Handle Check-Out Action
	const handleCheckedOut = async (uuid) => {
		const reservationId = uuid;
		const checkedOut = getFormattedTime();

		try {
			await getCheckedOut(restaurantId, reservationId, checkedOut);
			fetchGuestReservationInfo();
		} catch (error) {
			console.error('Error during check-out:', error);
		}
	};

	// Handle Cancel Action (Placeholder)
	const handleCancel = async (uuid) => {
		// console.log('Cancel Reservation ID:', uuid);
	};

	// Handle Viewing Reservation Details
	const handleView = (uuid) => {
		const reservationDetail = restaurantInfo?.data?.data.find((item) => item?.uuid === uuid);
		if (reservationDetail) {
			setSelectedReservationDetails(reservationDetail);
			setPopupType('view');
			setIsPopupOpen(true);
		}
	};

	// Close Popup
	const handleClosePopup = () => {
		setIsPopupOpen(false);
		setPopupType(null);
		setSelectedReservationDetails(null);
	};

	return (
		<div>
			<ReservationCard
				data={checkedInReservation}
				handleCheckedOut={handleCheckedOut}
				handleCancel={handleCancel}
				handleView={handleView}
				isLoading={loading}
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
							{userType === 'super_admin' ? (
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
