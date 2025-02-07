import React, {useContext, useState} from 'react';
import TodayTabComponent from './tabs/TodayTabComponent';
import UpcomingTabComponent from './tabs/UpcomingTabComponent';
import CheckedInTabComponent from './tabs/CheckedInTabComponent';
import CheckedOutTabComponent from './tabs/CheckedOutTabComponent';
import Tabs from '../../../ui-share/Tabs';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {AuthContextRestaurant} from '../../../context/AuthContextRestaurant';
import {useLocation} from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';

export default function ReservationPage() {
	const {id} = useParams();
	const location = useLocation();
	const {rest_name} = location.state || {};

	const storeRestaurantId = useSelector((state) => state.restaurantDetails?.restaurantDetails?.data?.uuid);
	const storeRestaurantDetails = useSelector((state) => state.restaurantDetails?.restaurantDetails);
	const {isAuthenticated, userType} = useContext(AuthContextRestaurant);
	const navigate = useNavigate();

	const tabs = [
		{
			label: 'Today',
			content: <TodayTabComponent restaurantId={id} />,
		},
		{
			label: 'Upcoming',
			content: <UpcomingTabComponent restaurantId={id} />,
		},
		{
			label: 'Checked In',
			content: <CheckedInTabComponent restaurantId={id} />,
		},
		{
			label: 'Check Out',
			content: <CheckedOutTabComponent restaurantId={id} />,
		},
	];

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	return (
		<>
			<PageTitle title="Reservation" description="Home Page Description" />
			<div className="min-h-screen">
				<div className="container">
					<div className="max-w-[700px] mx-auto px-5">
						<div className="flex flex-col gap-5">
							<div className="flex items-center justify-between">
								<h1 className="text-2xl font-bold">{rest_name} Reservation</h1>
								{/* <div className="flex items-center space-x-4">
									<button
										className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
										onClick={handleRestaurantList}
									>
										Restaurant List
									</button>
								</div> */}
								{isAuthenticated && userType === 'super_admin' && (
									<div className="flex items-center space-x-4">
										<button
											className="bg-button text-white p-2 rounded-lg hover:bg-buttonHover focus:outline-none focus:ring-2"
											onClick={handleRestaurantList}
										>
											Restaurant List
										</button>
									</div>
								)}
							</div>
							<div className="">
								<Tabs tabs={tabs} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
