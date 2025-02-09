import React, {useContext, useEffect, useState} from 'react';
import PageTitle from '../../../components/PageTitle';
import {getRestaurantList, totalGuestList, totalReservationList} from '../../../api';
import {AuthContextRestaurant} from './../../../context/AuthContextRestaurant';
import {formatDate, formatTime} from '../../../utils/conversions';

const Dashboard = () => {
	const {user, userType, userToken} = useContext(AuthContextRestaurant);

	const [data, setData] = useState({
		restaurantList: [],
		guestList: [],
		reservationList: [],
		todayReservations: [],
		upcomingReservations: [],
		loading: true,
		reportData: [],
		othersData: [],
	});

	const fetchDashboardData = async () => {
		setData((prevState) => ({...prevState, loading: true}));

		try {
			const [restaurantResponse, guestResponse, reservationResponse] = await Promise.all([
				getRestaurantList(),
				totalGuestList(),
				totalReservationList(),
			]);

			const restaurants = restaurantResponse.data.data.data;
			const guests = guestResponse.data;
			const reservations = reservationResponse.data;

			setData((prevState) => ({
				...prevState,
				restaurantList: restaurants,
				guestList: guests,
				reservationList: reservations,
				loading: false,
			}));
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
			setData((prevState) => ({...prevState, loading: false}));
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, [userType, user.res_uuid]);

	const today = new Date().toLocaleDateString('en-GB');

	// for admin report
	const todaysReservationForRestaurantAdmin = data.reservationList.filter(
		(reservation) => reservation?.reservation_date === today && reservation?.restaurant?.uuid === user.res_uuid
	);

	const upcomingReservationsForRestaurantsAdmin = data.reservationList.filter(
		(reservation) => reservation?.reservation_date > today && reservation?.restaurant?.uuid === user.res_uuid
	);

	const completedReservationsForRestaurantsAdmin = data.reservationList.filter(
		(reservation) => reservation?.status === 'completed' && reservation?.restaurant.uuid === user.rest_uuid
	);

	const cancelledReservationsForRestaurantsAdmin = data.reservationList.filter(
		(reservation) => reservation?.status === 'cancelled' && reservation?.restaurant.uuid === user.rest_uuid
	);

	const totalCustomersForRestaurantsOwnerAdmin = todaysReservationForRestaurantAdmin.reduce((total, reservation) => {
		return total + parseInt(reservation.number_of_people, 10);
	}, 0);

	// Update the reportData based on the userType and other computed values
	const reportData =
		userType === 'super_admin'
			? [
					{
						icon: '🍽️',
						label: 'Total Restaurants',
						bgColor: 'bg-yellow-100',
						textColor: 'text-yellow-500',
						value: data.restaurantList.length || 'N/A',
					},
					{
						icon: '👥',
						label: 'Total Customers',
						bgColor: 'bg-green-100',
						textColor: 'text-green-500',
						value: data.guestList.length || 'N/A',
					},
					{
						icon: '📋',
						label: 'Total Reservations',
						bgColor: 'bg-indigo-100',
						textColor: 'text-indigo-500',
						value: data.reservationList.length || 'N/A',
					},
					{
						icon: '💰',
						label: 'Total Revenue',
						bgColor: 'bg-blue-100',
						textColor: 'text-blue-500',
						value: 'N/A', // Add actual value if available
					},
			  ]
			: [
					{
						icon: '📋',
						label: "Today's Reservations",
						bgColor: 'bg-indigo-100',
						textColor: 'text-indigo-500',
						value: todaysReservationForRestaurantAdmin.length || 'N/A',
					},
					{
						icon: '✔️',
						label: 'Confirmed Reservations',
						bgColor: 'bg-green-100',
						textColor: 'text-green-500',
						value: completedReservationsForRestaurantsAdmin.length || 'N/A',
					},
					{
						icon: '❌',
						label: 'Cancelled Reservations',
						bgColor: 'bg-red-100',
						textColor: 'text-red-500',
						value: cancelledReservationsForRestaurantsAdmin.length || 'N/A',
					},
					{
						icon: '👥',
						label: 'Total Customers Today',
						bgColor: 'bg-green-100',
						textColor: 'text-green-500',
						value: totalCustomersForRestaurantsOwnerAdmin || 'N/A',
					},
					{
						icon: '💰',
						label: 'Total Revenue',
						bgColor: 'bg-blue-100',
						textColor: 'text-blue-500',
						value: 'N/A', // Add actual value if available
					},
			  ];

	const othersData =
		userType === 'super_admin'
			? [
					{label: 'Active Restaurant', value: 'N/A'},
					{label: 'Inactive Restaurant', value: 'N/A'},
					{label: "Today's Reservations", value: 'N/A'},
					{label: "Today's Revenue", value: 'N/A'}, // Dummy calculation
			  ]
			: [
					{label: 'Total Customers', value: 'N/A'},
					{label: 'Available Tables', value: 'N/A'}, // Static for example
					{label: 'Available Slots', value: 'N/A'},
					{label: "Today's No-shows", value: 'N/A'},
			  ];

	return (
		<>
			<PageTitle title="Dashboard" description="Home Page Description" />
			<div className="min-h-screen bg-[#F7F8FA] p-4">
				{/* Report Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
					{reportData.map((item, index) => (
						<div key={index} className={`p-4 rounded-lg shadow-md ${item.bgColor}`}>
							<div className="flex items-center">
								<span className={`text-4xl ${item.textColor}`}>{item.icon}</span>
								<div className="ml-4">
									<h3 className="text-2xl font-semibold">{data.loading ? 'Loading...' : item.value}</h3>
									<p className="text-gray-600">{item.label}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Additional Info */}
				<div className="p-4 bg-white rounded-lg shadow-md mb-4">
					<div className="flex justify-between">
						{othersData.map((item, index) => (
							<div key={index} className="text-center">
								<h3 className="text-lg font-semibold">{data.loading ? 'Loading...' : item.value}</h3>
								<p className="text-gray-500">{item.label}</p>
							</div>
						))}
					</div>
				</div>

				{/* Reservations Tables */}

				{userType !== 'super_admin' && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Today's Reservations Section */}
						<div className="p-4 bg-purple-100 rounded-lg shadow-md min-h-[400px] flex flex-col">
							<h3 className="text-xl font-semibold mb-4">Today's Reservations</h3>

							{/* Scrollable Table */}
							<div className="overflow-y-auto max-h-[300px]">
								<table className="min-w-full w-full bg-white border border-gray-200">
									<thead className="bg-gray-100 text-left sticky top-0">
										<tr>
											<th className="px-4 border">Serial No</th>
											<th className="px-4 border">Reservation ID</th>
											<th className="px-4 border">Customer Name</th>
											<th className="px-4 border">Customer Phone</th>
											<th className="px-4 border">Customer Email</th>
											<th className="px-4 border">Table Number</th>
											<th className="px-4 border">Time</th>
											<th className="px-4 border">Status</th>
										</tr>
									</thead>
									<tbody>
										{todaysReservationForRestaurantAdmin.map((reservation, index) => (
											<tr key={index} className="hover:bg-gray-50">
												<td className="px-4 border">{index + 1}</td>
												<td className="px-4 border">{reservation.reservation_id}</td>
												<td className="px-4 border">
													{reservation.guest_information.first_name} {reservation.guest_information.last_name}
												</td>
												<td className="px-4 border">{reservation.guest_information.phone}</td>
												<td className="px-4 border">{reservation.guest_information.email}</td>
												<td className="px-4 border">{reservation.table_master.table_name}</td>
												<td className="px-4 border">{formatTime(reservation.start)}</td>
												<td className="px-4 border capitalize">{reservation.status}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Upcoming Reservations Section */}
						<div className="p-4 bg-blue-100 rounded-lg shadow-md min-h-[400px] flex flex-col">
							<h3 className="text-xl font-semibold mb-4">Upcoming Reservations</h3>

							{/* Scrollable Table */}
							<div className="overflow-y-auto max-h-[300px]">
								<table className="min-w-full w-full bg-white border border-gray-200">
									<thead className="bg-gray-100 text-left sticky top-0">
										<tr>
											<th className="px-4 border">Serial No</th>
											<th className="px-4 border">Reservation ID</th>
											<th className="px-4 border">Customer Name</th>
											<th className="px-4 border">Customer Phone</th>
											<th className="px-4 border">Customer Email</th>
											<th className="px-4 border">Table Number</th>
											<th className="px-4 border">Date</th>
											<th className="px-4 border">Time</th>
											<th className="px-4 border">Status</th>
										</tr>
									</thead>
									<tbody>
										{upcomingReservationsForRestaurantsAdmin.map((reservation, index) => (
											<tr key={index} className="hover:bg-gray-50">
												<td className="px-4 border">{index + 1}</td>
												<td className="px-4 border">{reservation.reservation_id}</td>
												<td className="px-4 border">
													{reservation.guest_information.first_name} {reservation.guest_information.last_name}
												</td>
												<td className="px-4 border">{reservation.guest_information.email}</td>
												<td className="px-4 border">{reservation.guest_information.phone}</td>
												<td className="px-4 border">{reservation.table_master.table_name}</td>
												<td className="px-4 border">{reservation.reservation_date}</td>
												<td className="px-4 border">{formatTime(reservation.start)}</td>
												<td className="px-4 border capitalize">{reservation.status}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Dashboard;
