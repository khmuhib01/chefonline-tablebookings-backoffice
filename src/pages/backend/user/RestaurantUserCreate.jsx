import React, {useState, useEffect, useRef, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useDropzone} from 'react-dropzone';
import {Cross, Edit} from '../../../ui-share/Icon';
import InputField from './../../../ui-share/InputField';
import {useSelector} from 'react-redux';
import {createRestaurantUser, restaurantUserList} from '../../../api';
import toast, {Toaster} from 'react-hot-toast';
import Popup from './../../../ui-share/Popup';
import {useLocation} from 'react-router-dom';
import {AuthContextRestaurant} from '../../../context/AuthContextRestaurant';

export default function RestaurantUserCreate() {
	const {id} = useParams();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState('Create User');
	const {rest_name} = location.state || {};
	const [userData, setUserData] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
		post_code: '',
		password: '',
		userType: '',
		status: 'active',
		avatar: null,
		restaurant_id: id,
	});
	const [errors, setErrors] = useState({});
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupContent, setPopupContent] = useState('');
	const [userListData, setUserListData] = useState([]); // Store users
	const [loading, setLoading] = useState(false);

	// Edit Popup State
	const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
	const [editUserData, setEditUserData] = useState({});

	const [loadingTags, setLoadingTags] = useState(false);
	const fileInputRef = useRef(null);

	const {isAuthenticated, userType} = useContext(AuthContextRestaurant);

	const navigate = useNavigate();
	// const storeUser = useSelector((state) => state.user.user.uuid);
	const storeUser = useSelector((state) => state.user.user);

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setUserData({...userData, [name]: value});
		setErrors({...errors, [name]: ''}); // Clear errors on change
	};

	const validateFields = () => {
		const newErrors = {};
		if (!userData.name) newErrors.name = 'User name is required';

		// Email validation
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!userData.email) {
			newErrors.email = 'Email is required';
		} else if (!emailPattern.test(userData.email)) {
			newErrors.email = 'Enter a valid email';
		}

		// Phone number validation
		const phonePattern = /^\d{11}$/;
		if (!userData.phone) {
			newErrors.phone = 'Phone number is required';
		} else if (!phonePattern.test(userData.phone)) {
			newErrors.phone = 'Phone number must be 11 digits';
		}

		// Password validation
		if (!userData.password) {
			newErrors.password = 'Password is required';
		}

		// Post Code validation
		if (!userData.post_code) {
			newErrors.post_code = 'Post Code is required';
		}

		// User type validation
		if (!userData.userType) {
			newErrors.userType = 'User type is required';
		}

		return newErrors;
	};

	const onSingleDrop = (acceptedFiles) => {
		const file = acceptedFiles[0];
		setUserData({...userData, avatar: file}); // Store the file object
	};

	const handleRemoveSingleImage = () => {
		setUserData({...userData, avatar: null});
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const generatePassword = () => {
		const randomPassword = Math.random().toString(36).slice(-10); // Generate a random 10-character password
		setUserData({...userData, password: randomPassword});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validateFields();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		// If needed, you can comment out the API call to see the console.log result
		// Use FormData to handle file uploads
		const formData = new FormData();
		formData.append('name', userData.name);
		formData.append('email', userData.email);
		formData.append('phone', userData.phone);
		formData.append('address', userData.address);
		formData.append('post_code', userData.post_code); // Append the Post Code
		formData.append('password', userData.password); // Append the password
		formData.append('user_type', userData.userType); // Append the user type
		formData.append('status', userData.status); // Append the status
		if (userData.avatar) {
			formData.append('avatar', userData.avatar); // Append the file
		}
		formData.append('created_by', storeUser);
		formData.append('res_uuid', id);
		formData.append('params', 'create');

		try {
			const response = await createRestaurantUser(formData);
			if (response) {
				toast.success('User created successfully!', {position: 'top-center'});
				setUserData({
					name: '',
					email: '',
					phone: '',
					address: '',
					post_code: '',
					password: '',
					userType: '',
					status: 'active',
					avatar: null,
					restaurant_id: id,
				});
			} else {
				toast.error('Failed to create user', {position: 'top-center'});
			}
		} catch (error) {
			console.error('Error creating user:', error);

			// Convert the error object to a string or an array of messages
			const errorMessages = Object.values(error.response?.data?.errors || {})
				.flat()
				.join('\n');

			// Show Popup with error message
			setPopupContent(errorMessages || 'An error occurred while creating the user.');
			setIsPopupOpen(true);
		}
	};

	// Fetch users when switching to "User List" tab
	useEffect(() => {
		if (activeTab === 'User List') {
			fetchUserList();
		}
	}, [activeTab]);

	useEffect(() => {
		// Cleanup for single image
		return () => {
			if (userData.avatar) {
				URL.revokeObjectURL(userData.avatar);
			}
		};
	}, [userData.avatar]);

	const singleImageDropzone = useDropzone({
		onDrop: onSingleDrop,
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/gif': [],
			'image/bmp': [],
		},
		multiple: false,
	});

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	// Fetch User List
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
			fetchUserList();
		} catch (error) {
			console.error('Error fetching user list:', error);
		} finally {
			setLoading(false);
		}
	};

	// Update User API Call
	const handleUpdateUser = async (e) => {
		e.preventDefault();

		try {
			const data = {...editUserData, params: 'update', restaurant_id: id};
			const response = await updateRestaurantUser(data);
			if (response) {
				toast.success('User updated successfully!', {position: 'top-center'});
				fetchUserList();
				closeEditPopup();
			} else {
				toast.error('Failed to update user', {position: 'top-center'});
			}
		} catch (error) {
			console.error('Error updating user:', error);
			toast.error('An error occurred while updating the user.', {position: 'top-center'});
		}
	};

	// Open Edit Popup
	const handleEditUser = (user) => {
		setEditUserData(user);
		setIsEditPopupOpen(true);
	};

	// Close Edit Popup
	const closeEditPopup = () => {
		setIsEditPopupOpen(false);
		setEditUserData({});
	};

	const renderTabContent = () => {
		if (loadingTags) {
			return <div>Loading...</div>; // Display loading indicator while fetching tags
		}
		if (activeTab === 'Create User') {
			return (
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-lg p-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col w-full">
							<label htmlFor="name" className="block text-sm font-medium text-gray-700">
								User Name <span className="text-red-500">*</span>
							</label>
							<InputField
								type="text"
								name="name"
								placeholder="Name"
								value={userData.name}
								onChange={handleInputChange}
								error={errors.name}
							/>
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email <span className="text-red-500">*</span>
							</label>
							<InputField
								type="email"
								name="email"
								placeholder="Email"
								value={userData.email}
								onChange={handleInputChange}
								error={errors.email}
							/>
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
								Phone <span className="text-red-500">*</span>
							</label>
							<InputField
								type="text"
								name="phone"
								placeholder="Phone"
								value={userData.phone}
								onChange={handleInputChange}
								error={errors.phone}
							/>
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="address" className="block text-sm font-medium text-gray-700">
								Address
							</label>
							<InputField
								type="text"
								name="address"
								placeholder="Address"
								value={userData.address}
								onChange={handleInputChange}
								error={errors.address}
							/>
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="post_code" className="block text-sm font-medium text-gray-700">
								Post Code <span className="text-red-500">*</span>
							</label>
							<InputField
								type="text"
								name="post_code"
								placeholder="Post Code"
								value={userData.post_code}
								onChange={handleInputChange}
								error={errors.post_code}
							/>
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<InputField
								type="text"
								name="password"
								placeholder="Password"
								value={userData.password}
								onChange={handleInputChange}
								error={errors.password}
							/>
							<button
								type="button"
								onClick={generatePassword}
								className="mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
							>
								Generate Password
							</button>
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="userType" className="block text-sm font-medium text-gray-700">
								User Type <span className="text-red-500">*</span>
							</label>
							<select
								name="userType"
								value={userData.userType}
								onChange={handleInputChange}
								className={`border rounded p-2 text-base focus:outline-none focus:shadow ${
									errors.userType ? 'border-red-500' : 'border-gray-300'
								}`}
							>
								<option value="">Select a type</option>
								<option value="admin">Admin</option>
								<option value="staff">Staff</option>
							</select>
							{errors.userType && <span className="text-sm text-red-500">{errors.userType}</span>}
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="status" className="block text-sm font-medium text-gray-700">
								Status
							</label>
							<select
								name="status"
								value={userData.status}
								onChange={handleInputChange}
								className={`border rounded p-2 text-base focus:outline-none focus:shadow ${
									errors.status ? 'border-red-500' : 'border-gray-300'
								}`}
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
							{errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
						</div>
					</div>

					<div className="mt-6">
						<label className="block text-sm font-medium text-gray-700">Upload User Image</label>
						<div
							{...singleImageDropzone.getRootProps({
								onClick: (e) => {
									e.stopPropagation();
									fileInputRef.current?.click();
								},
							})}
							className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer"
							aria-label="Upload a single image"
						>
							<input {...singleImageDropzone.getInputProps()} ref={fileInputRef} />
							{userData.avatar ? (
								<div className="h-48 w-48 m-auto relative">
									<img
										src={URL.createObjectURL(userData.avatar)}
										alt="Single Preview"
										className="mx-auto h-48 w-48 rounded-md bg-white p-2 shadow-md"
									/>
									<button
										onClick={handleRemoveSingleImage}
										className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500"
										aria-label="Remove image"
									>
										<Cross className="h-5 w-5 bg-white shadow-md rounded-full" />
									</button>
								</div>
							) : (
								<p>Drag & drop an image here, or click to select one</p>
							)}
						</div>
					</div>

					<div className="mt-6 text-right">
						<button type="submit" className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover">
							Create User
						</button>
					</div>
				</form>
			);
		} else if (activeTab === 'User List') {
			return (
				<div className="flex flex-col gap-5">
					{loading ? (
						<p>Loading users...</p>
					) : (
						<table className="min-w-full bg-white border border-gray-300">
							<thead>
								<tr className="bg-gray-200">
									<th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Name</th>
									<th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Email</th>
									<th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Type</th>
									<th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Action</th>
								</tr>
							</thead>
							<tbody>
								{userListData.length > 0 ? (
									userListData.map((user, index) => (
										<tr key={user.id || index}>
											<td className="py-2 px-4 border-b text-sm text-gray-800">{user.name}</td>
											<td className="py-2 px-4 border-b text-sm text-gray-800">{user.email}</td>
											<td className="py-2 px-4 border-b text-sm text-gray-800">{user.user_type}</td>
											<td className="py-2 px-4 border-b text-sm text-gray-800">
												<div className="flex gap-3">
													<Edit
														className="hover:cursor-pointer hover:buttonHover"
														onClick={() => handleEditUser(user)}
													/>
													<Cross
														className="hover:cursor-pointer hover:buttonHover"
														onClick={() => handleDeleteUser(user)}
													/>
												</div>
											</td>
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
			);
		}
		return null;
	};

	return (
		<>
			<div className="p-5 max-w-3xl mx-auto rounded">
				<div className="flex flex-col gap-5">
					<div className="md:flex items-center justify-between space-y-5">
						<h1 className="text-2xl font-bold leading-none">{rest_name} User Info</h1>

						{isAuthenticated && userType === 'super_admin' && (
							<button
								className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
								onClick={handleRestaurantList} // Corrected this line
							>
								Restaurant List
							</button>
						)}
					</div>

					<div className="flex items-center space-x-4 mb-4 overflow-x-scroll sm:overflow-x-hidden border-b">
						{['Create User', 'User List'].map((tab) => (
							<button
								key={tab}
								onClick={() => handleTabChange(tab)}
								className={`text-lg ${
									activeTab === tab ? 'font-semibold text-button border-b-2 border-button' : 'text-gray-500'
								}`}
							>
								{tab}
							</button>
						))}
					</div>
					{renderTabContent()}
				</div>
			</div>

			<Toaster />
			<Popup isOpen={isPopupOpen} title="Error" content={popupContent} onClose={() => setIsPopupOpen(false)} />

			{/* Edit User Popup */}
			{isEditPopupOpen && (
				<Popup
					isOpen={isEditPopupOpen}
					title="Edit User"
					onClose={closeEditPopup}
					content={
						<form onSubmit={handleUpdateUser} className="flex flex-col gap-4 bg-white rounded-lg p-6">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="flex flex-col w-full">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										User Name <span className="text-red-500">*</span>
									</label>
									<InputField
										type="text"
										name="name"
										placeholder="Name"
										value={userData.name}
										onChange={handleInputChange}
										error={errors.name}
									/>
								</div>
								<div className="flex flex-col w-full">
									<label htmlFor="email" className="block text-sm font-medium text-gray-700">
										Email <span className="text-red-500">*</span>
									</label>
									<InputField
										type="email"
										name="email"
										placeholder="Email"
										value={userData.email}
										onChange={handleInputChange}
										error={errors.email}
									/>
								</div>
								<div className="flex flex-col w-full">
									<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
										Phone <span className="text-red-500">*</span>
									</label>
									<InputField
										type="text"
										name="phone"
										placeholder="Phone"
										value={userData.phone}
										onChange={handleInputChange}
										error={errors.phone}
									/>
								</div>
								<div className="flex flex-col w-full">
									<label htmlFor="address" className="block text-sm font-medium text-gray-700">
										Address
									</label>
									<InputField
										type="text"
										name="address"
										placeholder="Address"
										value={userData.address}
										onChange={handleInputChange}
										error={errors.address}
									/>
								</div>
								<div className="flex flex-col w-full">
									<label htmlFor="post_code" className="block text-sm font-medium text-gray-700">
										Post Code <span className="text-red-500">*</span>
									</label>
									<InputField
										type="text"
										name="post_code"
										placeholder="Post Code"
										value={userData.post_code}
										onChange={handleInputChange}
										error={errors.post_code}
									/>
								</div>
								<div className="flex flex-col w-full">
									<label htmlFor="password" className="block text-sm font-medium text-gray-700">
										Password
									</label>
									<InputField
										type="text"
										name="password"
										placeholder="Password"
										value={userData.password}
										onChange={handleInputChange}
										error={errors.password}
									/>
									<button
										type="button"
										onClick={generatePassword}
										className="mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
									>
										Generate Password
									</button>
								</div>
								<div className="flex flex-col w-full">
									<label htmlFor="userType" className="block text-sm font-medium text-gray-700">
										User Type <span className="text-red-500">*</span>
									</label>
									<select
										name="userType"
										value={userData.userType}
										onChange={handleInputChange}
										className={`border rounded p-2 text-base focus:outline-none focus:shadow ${
											errors.userType ? 'border-red-500' : 'border-gray-300'
										}`}
									>
										<option value="">Select a type</option>
										<option value="admin">Admin</option>
										<option value="staff">Staff</option>
									</select>
									{errors.userType && <span className="text-sm text-red-500">{errors.userType}</span>}
								</div>
								<div className="flex flex-col w-full">
									<label htmlFor="status" className="block text-sm font-medium text-gray-700">
										Status
									</label>
									<select
										name="status"
										value={userData.status}
										onChange={handleInputChange}
										className={`border rounded p-2 text-base focus:outline-none focus:shadow ${
											errors.status ? 'border-red-500' : 'border-gray-300'
										}`}
									>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
									</select>
									{errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
								</div>
							</div>

							<div className="mt-6">
								<label className="block text-sm font-medium text-gray-700">Upload User Image</label>
								<div
									{...singleImageDropzone.getRootProps({
										onClick: (e) => {
											e.stopPropagation();
											fileInputRef.current?.click();
										},
									})}
									className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer"
									aria-label="Upload a single image"
								>
									<input {...singleImageDropzone.getInputProps()} ref={fileInputRef} />
									{userData.avatar ? (
										<div className="h-48 w-48 m-auto relative">
											<img
												src={URL.createObjectURL(userData.avatar)}
												alt="Single Preview"
												className="mx-auto h-48 w-48 rounded-md bg-white p-2 shadow-md"
											/>
											<button
												onClick={handleRemoveSingleImage}
												className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500"
												aria-label="Remove image"
											>
												<Cross className="h-5 w-5 bg-white shadow-md rounded-full" />
											</button>
										</div>
									) : (
										<p>Drag & drop an image here, or click to select one</p>
									)}
								</div>
							</div>

							<div className="mt-6 text-right">
								<button type="submit" className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover">
									Create User
								</button>
							</div>
						</form>
					}
				/>
			)}
		</>
	);
}
