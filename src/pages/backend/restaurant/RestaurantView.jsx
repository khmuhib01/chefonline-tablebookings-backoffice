import React, {useEffect, useState, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {getRestaurantDetails, getRestaurantSearchTagList, restaurantAboutTag, restaurantUserList} from '../../../api';
import {Edit} from '../../../ui-share/Icon';
import {useSelector} from 'react-redux';
import {AuthContextRestaurant} from '../../../context/AuthContextRestaurant';
import PageTitle from '../../../components/PageTitle';

export default function RestaurantView() {
	const navigate = useNavigate();
	const {id} = useParams();
	const [userListData, setUserListData] = useState([]);
	const [restaurantSearchTagList, setRestaurantSearchTagList] = useState([]);
	const [restaurantAboutTagList, setRestaurantAboutTagList] = useState([]);
	const [restaurantDetails, setRestaurantDetails] = useState(null);
	const [loading, setLoading] = useState(false);

	const {userType, user, userToken} = useContext(AuthContextRestaurant);

	const storeUser = useSelector((state) => state.user.user);

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	const fetchUserList = async () => {
		setLoading(true);
		try {
			const data = {
				rest_uuid: id,
				user_uuid: storeUser?.uuid,
				params: 'info',
			};
			const response = await restaurantUserList(data);
			setUserListData(response.data);
		} catch (error) {
			console.error('Error fetching user list:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchRestaurantSearchTagList = async () => {
		setLoading(true);
		try {
			const data = {
				rest_uuid: id,
				params: 'info',
			};
			const response = await getRestaurantSearchTagList(data);
			setRestaurantSearchTagList(response.data.data);
		} catch (error) {
			console.error('Error fetching search tags:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchRestaurantAboutTagList = async () => {
		setLoading(true);
		try {
			const data = {
				rest_uuid: id,
				params: 'info',
			};
			const response = await restaurantAboutTag(data);
			setRestaurantAboutTagList(response.data.data);
		} catch (error) {
			console.error('Error fetching about tags:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchRestaurantDetail = async () => {
		setLoading(true);
		try {
			const response = await getRestaurantDetails(id);
			setRestaurantDetails(response.data);
		} catch (error) {
			console.error('Error fetching restaurant details:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserList();
		fetchRestaurantSearchTagList();
		fetchRestaurantAboutTagList();
		fetchRestaurantDetail();
	}, [id]);

	const handleTagEditClick = () => {
		navigate(`/dashboard/restaurant-tag/${id}`);
	};

	const handleDetailEditClick = () => {
		navigate(`/dashboard/edit-restaurant/${id}`);
	};

	return (
		<>
			<PageTitle title="Restaurant View" description="Home Page Description" />
			<div className="container mx-auto p-4">
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center">
						<a href="/" className="mr-4 text-xl">
							<span role="img" aria-label="home">
								🏠
							</span>
						</a>
						<h2 className="text-2xl font-semibold">
							{restaurantDetails?.name} : (ID-{restaurantDetails?.id})
						</h2>
					</div>
					<button
						className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
						onClick={handleRestaurantList}
					>
						Restaurant List
					</button>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Owner Details */}
					<div className="border p-4 rounded-md shadow-md bg-white">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Details</h3>
							<Edit onClick={handleDetailEditClick} className="hover:cursor-pointer" />
						</div>
						{loading ? (
							<div className="flex justify-center items-center py-10">
								<div className="loader">Loading...</div> {/* Replace with your actual loading spinner */}
							</div>
						) : (
							<div className="grid grid-cols-2 gap-2">
								<div>
									<label className="block font-medium">Restaurant Name:</label>
									<span>{restaurantDetails?.name}</span>
								</div>
								<div className="overflow-hidden">
									<label className="block font-medium">Invoice Email:</label>
									<span className="block truncate">{restaurantDetails?.email}</span>
								</div>
								<div>
									<label className="block font-medium">Business Contact:</label>
									<span>{restaurantDetails?.phone}</span>
								</div>
								<div>
									<label className="block font-medium">Business Address:</label>
									<span className="block break-words">{restaurantDetails?.address}</span>
								</div>
								<div>
									<label className="block font-medium">Category:</label>
									<div className="flex gap-2">
										{restaurantDetails?.categories &&
											restaurantDetails?.categories.map((item, index) => {
												return (
													<span className="bg-gray-300 px-2 py-1 rounded-full text-xs" key={item.id || index}>
														{item?.name}
													</span>
												);
											})}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="border p-4 rounded-md shadow-md bg-white">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Tags</h3>
							<Edit onClick={handleTagEditClick} className="hover:cursor-pointer" />
						</div>
						{loading ? (
							<div className="flex justify-center items-center py-10">
								<div className="loader">Loading...</div>
							</div>
						) : (
							<div className="flex flex-col gap-2">
								<div>
									<label className="block font-medium">Restaurant Search Tag</label>
									<div className="flex gap-2">
										{restaurantSearchTagList && restaurantSearchTagList.length > 0 ? (
											restaurantSearchTagList.map((tag, index) => (
												<span
													className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full uppercase"
													key={tag.id || index}
												>
													{tag.name}
												</span>
											))
										) : (
											<span className="text-xs text-gray-500">No tags available</span>
										)}
									</div>
								</div>
								<div>
									<label className="block font-medium">Restaurant About Tag</label>
									<div className="flex gap-2">
										{restaurantAboutTagList && restaurantAboutTagList.length > 0 ? (
											restaurantAboutTagList.map((tag, index) => (
												<span
													key={tag.id || index}
													className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full uppercase"
												>
													{tag.name}
												</span>
											))
										) : (
											<span className="text-xs text-gray-500">No tags available</span>
										)}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="border p-4 rounded-md shadow-md bg-white">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Users</h3>
						</div>
						<div className="overflow-x-auto">
							{loading ? (
								<div className="text-center py-4">Loading Users...</div>
							) : (
								<table className="min-w-full bg-white">
									<thead>
										<tr>
											<th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Name</th>
											<th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Email</th>
											<th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Type</th>
										</tr>
									</thead>
									<tbody>
										{userListData && userListData.length > 0 ? (
											userListData.map((user, index) => (
												<tr key={user.id || index}>
													<td className="py-2 px-4 border-b text-sm text-gray-800">{user.name}</td>
													<td className="py-2 px-4 border-b text-sm text-gray-800">{user.email}</td>
													<td className="py-2 px-4 border-b text-sm text-gray-800">{user.user_type}</td>
												</tr>
											))
										) : (
											<tr>
												<td className="py-2 px-4 border-b text-sm text-gray-800" colSpan="3">
													No users found
												</td>
											</tr>
										)}
									</tbody>
								</table>
							)}
						</div>
						{/* Add any additional information here */}
					</div>
				</div>
			</div>
		</>
	);
}
