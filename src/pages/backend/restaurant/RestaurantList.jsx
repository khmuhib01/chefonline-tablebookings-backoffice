import React, {useEffect, useState} from 'react';
import {Menu, OptionMenu, VerticalMenu} from '../../../ui-share/Icon';
import {NavLink, useNavigate} from 'react-router-dom';
import {getRestaurantList} from '../../../api';
import {useSelector, useDispatch} from 'react-redux';
import {setUser} from '../../../store/reducers/userSlice';
import PageTitle from '../../../components/PageTitle';
import {appConfig} from '../../../AppConfig';

export default function RestaurantList() {
	const [restaurants, setRestaurants] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [activeDropdown, setActiveDropdown] = useState(null);
	const [loading, setLoading] = useState(false); // Loading state

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const storeUser = useSelector((state) => state.user.user);

	const itemsPerPage = 20;

	const baseImageUrl = appConfig.baseUrl;

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1); // Reset to the first page when searching
	};

	// Ensure the data is filtered correctly
	const filteredData = restaurants.filter((item) =>
		Object.values(item).some((value) =>
			value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
		)
	);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

	console.log('paginatedData', paginatedData);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	const toggleDropdown = (id) => {
		setActiveDropdown((prev) => (prev === id ? null : id));
	};

	const handleMouseLeave = () => {
		setActiveDropdown(null);
	};

	useEffect(() => {
		fetchRestaurantList();
	}, []);

	const fetchRestaurantList = async () => {
		setLoading(true); // Set loading state to true before starting fetch
		try {
			const response = await getRestaurantList();
			if (response.data && response.data.data && response.data.data.data) {
				setRestaurants(response.data.data.data);
			} else {
				console.error('Invalid response structure', response);
				setRestaurants([]);
			}
		} catch (error) {
			console.error('Error fetching restaurant list:', error);
			setRestaurants([]);
		} finally {
			setLoading(false); // Set loading state to false after fetch completes
		}
	};

	const handleCreateRestaurant = () => {
		navigate('/dashboard/create-restaurant');
	};

	const handleRestaurantView = (uuid) => {
		dispatch(
			setUser({
				...storeUser,
				res_uuid: uuid,
			})
		);
		navigate(`/dashboard/restaurant-view/${uuid}`);
	};

	const handleRestaurantEdit = (uuid, item) => {
		// navigate(`/dashboard/edit-restaurant/${id}`);
		navigate(`/dashboard/edit-restaurant/${uuid}`, {state: {item}});
	};

	const handleRestaurantUserCreate = (uuid, rest_name) => {
		navigate(`/dashboard/user-create/${uuid}`, {state: {rest_name}});
	};

	const handleRestaurantMenuCreate = (uuid, rest_name) => {
		navigate(`/dashboard/restaurant-menu-create/${uuid}`, {state: {rest_name}});
	};

	const handleRestaurantGalleryCreate = (uuid, rest_name) => {
		navigate(`/dashboard/restaurant-gallery-create/${uuid}`, {state: {rest_name}});
	};

	const handleRestaurantTagCreate = (uuid, rest_name) => {
		navigate(`/dashboard/restaurant-tag/${uuid}`, {state: {rest_name}});
	};

	const handleRestaurantCapacityCreate = (uuid, rest_name) => {
		dispatch(
			setUser({
				...storeUser,
				res_uuid: uuid,
			})
		);
		navigate(`/dashboard/capacity/${uuid}`, {state: {rest_name}});
	};

	const handleRestaurantAvailabilityCreate = (uuid, rest_name) => {
		dispatch(
			setUser({
				...storeUser,
				res_uuid: uuid,
			})
		);
		navigate(`/dashboard/availability/${uuid}`, {state: {rest_name}});
	};

	const handleReservation = (uuid, rest_name) => {
		dispatch(
			setUser({
				...storeUser,
				res_uuid: uuid,
			})
		);

		// Navigate to the reservation page with the restaurant's uuid
		navigate(`/dashboard/reservation/${uuid}`, {state: {rest_name}});
	};

	return (
		<>
			<PageTitle title="Restaurant List" description="Home Page Description" />
			<div className="px-5 py-5">
				<div className="bg-white rounded-md p-5 shadow-md">
					<div className="flex flex-col gap-5">
						<div className="md:flex items-center justify-between space-y-5">
							<h1 className="text-2xl font-bold leading-none">Restaurant List</h1>
							<div className="flex items-center space-x-4">
								<input
									type="text"
									placeholder="Search..."
									value={searchTerm}
									onChange={handleSearchChange}
									className="border px-4 py-2 rounded-md w-full md:w-auto focus:outline-none focus:shadow"
								/>
								<button
									className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
									onClick={handleCreateRestaurant}
								>
									Add Restaurant
								</button>
							</div>
						</div>

						{loading ? (
							<div className="flex justify-center items-center py-10">
								<div className="loader">Loading...</div> {/* Replace with your actual loading spinner */}
							</div>
						) : (
							<div className="overflow-x-auto md:overflow-x-visible">
								<table className="min-w-full w-full bg-white border border-gray-200">
									<thead>
										<tr className="bg-gray-100 text-left">
											<th className="px-4 py-2 border">Serial No</th>
											<th className="px-4 py-2 border">Rest UUID</th>
											<th className="px-4 py-2 border">Image</th>
											<th className="px-4 py-2 border">Id</th>
											<th className="px-4 py-2 border">Name</th>
											<th className="px-4 py-2 border">Email</th>
											<th className="px-4 py-2 border">Phone</th>
											{/* <th className="px-4 py-2 border">Website</th> */}
											{/* <th className="px-4 py-2 border">Address</th> */}
											<th className="px-4 py-2 border">Postcode</th>
											<th className="px-4 py-2 border">Category</th>
											<th className="px-4 py-2 border">Reservation type</th>
											<th className="px-4 py-2 border">Status</th>
											<th className="px-4 py-2 border">Actions</th>
										</tr>
									</thead>
									<tbody>
										{paginatedData.length > 0 ? (
											paginatedData.map((item, index) => (
												<tr key={index} className="hover:bg-gray-50">
													<td className="px-4 py-2 border">{startIndex + index + 1}</td>
													<td className="px-4 py-2 border">{item.id || 'N/A'}</td>
													<td className="px-4 py-2 border">
														{item.avatar ? (
															<img
																src={baseImageUrl + item.avatar}
																alt="Restaurant Image"
																className="w-[100px] h-[100px] object-cover"
															/>
														) : (
															'N/A'
														)}
													</td>

													<td className="px-4 py-2 border">{item.uuid || 'N/A'}</td>
													<td className="px-4 py-2 border">{item.name || 'N/A'}</td>
													<td className="px-4 py-2 border">{item.email || 'N/A'}</td>
													<td className="px-4 py-2 border">{item.phone || 'N/A'}</td>
													{/* <td className="px-4 py-2 border">
														{item.website ? (
															<a
																href={item.website}
																className="text-blue-500 hover:underline"
																target="_blank"
																rel="noopener noreferrer"
															>
																{item.website}
															</a>
														) : (
															'N/A'
														)}
													</td> */}
													{/* <td className="px-4 py-2 border">{item.address || 'N/A'}</td> */}
													<td className="px-4 py-2 border">{item.post_code || 'N/A'}</td>
													<td className="px-4 py-2 border">
														{item.category_list && item?.category_list?.name ? item?.category_list?.name : 'N/A'}
													</td>
													<td className="px-4 py-2 border capitalize">{item.reservation_status || 'N/A'}</td>
													<td className="px-4 py-2 border text-center">
														<span
															className={`px-2 py-1 rounded-full text-white text-xs ${
																item.status === 'active' ? 'bg-green-500' : 'bg-red-500'
															}`}
														>
															{item.status === 'active' ? 'Active' : 'Inactive' || 'N/A'}
														</span>
													</td>
													<td className="px-4 py-2 border">
														<div className="relative">
															<OptionMenu
																className="cursor-pointer float-end"
																size={20}
																onClick={(e) => {
																	e.stopPropagation();
																	toggleDropdown(item.id);
																}}
															/>
															{activeDropdown === item.id && (
																<div
																	className="absolute top-full right-0 bg-white rounded-md shadow-lg px-3 py-2 z-10 w-[180px]"
																	onMouseLeave={handleMouseLeave}
																	onClick={(e) => e.stopPropagation()} // Prevent event propagation
																>
																	<ul>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleRestaurantEdit(item.uuid, item)}
																		>
																			Edit
																		</li>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleRestaurantView(item.uuid, item.name)}
																		>
																			View
																		</li>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleReservation(item.uuid, item.name)}
																		>
																			Reservation
																		</li>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleRestaurantCapacityCreate(item.uuid, item.name)}
																		>
																			Capacity
																		</li>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleRestaurantAvailabilityCreate(item.uuid, item.name)}
																		>
																			Opening/Closing
																		</li>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleRestaurantUserCreate(item.uuid, item.name)}
																		>
																			User Manage
																		</li>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleRestaurantTagCreate(item.uuid, item.name)}
																		>
																			Tags
																		</li>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleRestaurantMenuCreate(item.uuid, item.name)}
																		>
																			Menu create
																		</li>
																		<li
																			className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
																			onClick={() => handleRestaurantGalleryCreate(item.uuid, item.name)}
																		>
																			Gallery add
																		</li>
																	</ul>
																</div>
															)}
														</div>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan="11" className="px-4 py-2 border text-center">
													No results found
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						)}

						{!loading && (
							<div className="flex justify-between items-center mt-4">
								<button
									onClick={handlePreviousPage}
									disabled={currentPage === 1}
									className="bg-gray-200 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
								>
									Previous
								</button>
								<span>
									Page {currentPage} of {totalPages}
								</span>
								<button
									onClick={handleNextPage}
									disabled={currentPage === totalPages}
									className="bg-gray-200 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
								>
									Next
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
