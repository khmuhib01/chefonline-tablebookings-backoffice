import React, {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {useDropzone} from 'react-dropzone';
import {Cross} from '../../../ui-share/Icon';
import InputField from './../../../ui-share/InputField'; // Adjust the import path as needed
import {useSelector} from 'react-redux';
import {createRestaurant, getCategoryData, getRestaurantDetails} from '../../../api'; // Assume these API functions exist
import toast, {Toaster} from 'react-hot-toast';
import Popup from './../../../ui-share/Popup'; // Import your Popup component
import PageTitle from '../../../components/PageTitle';
import {appConfig} from '../../../AppConfig';

export default function RestaurantEdit() {
	const {id} = useParams(); // Get the restaurant ID from the URL
	const location = useLocation();
	const item = location.state?.item;

	const imageBaseUrl = appConfig.baseUrl;

	const capitalizeStatus = (status) => {
		return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
	};

	console.log('item', item);

	const [restaurantData, setRestaurantData] = useState({
		name: '',
		email: '',
		phone: '',
		website: '',
		address: '',
		post_code: '',
		category: '',
		status: item?.status || 'active',
		reservation_status: '',
		avatar: null, // New uploaded file
		avatarPreview: item?.avatar ? imageBaseUrl + item.avatar : '', // Full API URL for existing image
	});

	// const imageBaseUrl2 = imageBaseUrl + item.avatar;
	// console.log('imageBaseUrl2', imageBaseUrl2);

	const [categoryData, setCategoryData] = useState([]);
	const [errors, setErrors] = useState({});
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupContent, setPopupContent] = useState('');
	const fileInputRef = useRef(null);

	const navigate = useNavigate();
	const storeUser = useSelector((state) => state.user.user.uuid);

	useEffect(() => {
		if (item) {
			setRestaurantData({
				name: item.name || '',
				email: item.email || '',
				phone: item.phone || '',
				website: item.website || '',
				address: item.address || '',
				post_code: item.post_code || '',
				category: item.category || '',
				status: item.status ? item.status : 'active',
				reservation_status: item.reservation_status || 'manual',
				avatar: null,
			});
		} else {
			fetchRestaurantDetails(id);
		}
	}, [item, id]);

	useEffect(() => {
		fetchCategoryData();
	}, []);

	const fetchCategoryData = async () => {
		try {
			const {data} = await getCategoryData();
			setCategoryData(data);
		} catch (error) {
			console.error('Error fetching category data:', error);
		}
	};

	const fetchRestaurantDetails = async (restaurantId) => {
		try {
			const data = await getRestaurantDetails(restaurantId);
			setRestaurantData({
				name: data.name,
				email: data.email,
				phone: data.phone,
				website: data.website,
				address: data.address,
				post_code: data.post_code,
				category: data.category,
				status: data.status ? capitalizeStatus(data.status) : 'Active',
				reservation_status: data.reservation_status || 'manual',
				avatar: null, // Reset uploaded file
				avatarPreview: data.avatar ? imageBaseUrl + data.avatar : '', // Set existing image from API
			});
		} catch (error) {
			console.error('Error fetching restaurant details:', error);
		}
	};

	// const fetchRestaurantDetails = async (restaurantId) => {
	// 	try {
	// 		const data = await getRestaurantDetails(restaurantId);
	// 		setRestaurantData({
	// 			name: data.name,
	// 			email: data.email,
	// 			phone: data.phone,
	// 			website: data.website,
	// 			address: data.address,
	// 			post_code: data.post_code,
	// 			category: data.category,
	// 			status: data.status ? capitalizeStatus(data.status) : 'Active',
	// 			reservation_status: data.reservation_status || 'manual',
	// 			avatar: null,
	// 		});
	// 	} catch (error) {
	// 		console.error('Error fetching restaurant details:', error);
	// 	}
	// };

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setRestaurantData({...restaurantData, [name]: value});
		setErrors({...errors, [name]: ''});
	};

	const validateFields = () => {
		const newErrors = {};
		if (!restaurantData.name) newErrors.name = 'Restaurant name is required';

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!restaurantData.email) {
			newErrors.email = 'Email is required';
		} else if (!emailPattern.test(restaurantData.email)) {
			newErrors.email = 'Enter a valid email';
		}

		const phonePattern = /^\d{11}$/;
		if (!restaurantData.phone) {
			newErrors.phone = 'Phone number is required';
		} else if (!phonePattern.test(restaurantData.phone)) {
			newErrors.phone = 'Phone number must be 11 digits';
		}

		if (!restaurantData.reservation_status)
			newErrors.reservation_status = 'Please select a reservation acceptance type';

		if (!restaurantData.post_code) newErrors.post_code = 'Post code is required';

		return newErrors;
	};

	const onSingleDrop = (acceptedFiles) => {
		const file = acceptedFiles[0];
		if (file) {
			if (restaurantData.avatarPreview && restaurantData.avatarPreview.startsWith('blob:')) {
				URL.revokeObjectURL(restaurantData.avatarPreview); // Free memory of previous preview
			}
			const previewUrl = URL.createObjectURL(file);
			setRestaurantData((prevData) => ({
				...prevData,
				avatar: file,
				avatarPreview: previewUrl, // Update preview URL for new image
			}));
		}
	};

	const handleRemoveSingleImage = (e) => {
		e.stopPropagation();
		if (restaurantData.avatarPreview && restaurantData.avatarPreview.startsWith('blob:')) {
			URL.revokeObjectURL(restaurantData.avatarPreview); // Free memory
		}
		setRestaurantData((prevData) => ({
			...prevData,
			avatar: null,
			avatarPreview: '', // Remove preview
		}));
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	useEffect(() => {
		return () => {
			if (restaurantData.avatarPreview && restaurantData.avatarPreview.startsWith('blob:')) {
				URL.revokeObjectURL(restaurantData.avatarPreview);
			}
		};
	}, [restaurantData.avatarPreview]);

	// const onSingleDrop = (acceptedFiles) => {
	// 	const file = acceptedFiles[0];
	// 	setRestaurantData({...restaurantData, avatar: file});
	// };

	// const handleRemoveSingleImage = (e) => {
	// 	e.stopPropagation(); // Prevent the file input from being triggered
	// 	setRestaurantData({...restaurantData, avatar: null});
	// 	if (fileInputRef.current) {
	// 		fileInputRef.current.value = '';
	// 	}
	// };

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	const validationErrors = validateFields();
	// 	if (Object.keys(validationErrors).length > 0) {
	// 		setErrors(validationErrors);
	// 		return;
	// 	}

	// 	const formData = new FormData();
	// 	formData.append('name', restaurantData.name);
	// 	formData.append('email', restaurantData.email);
	// 	formData.append('phone', restaurantData.phone);
	// 	formData.append('website', restaurantData.website);
	// 	formData.append('address', restaurantData.address);
	// 	formData.append('post_code', restaurantData.post_code);
	// 	formData.append('category', restaurantData.category);
	// 	formData.append('status', restaurantData.status);
	// 	formData.append('reservation_status', restaurantData.reservation_status);
	// 	if (restaurantData.avatar) {
	// 		formData.append('avatar', restaurantData.avatar);
	// 	}

	// 	formData.append('uuid', id);
	// 	formData.append('params', 'update');
	// 	formData.append('updated_by', storeUser);

	// 	try {
	// 		const response = await createRestaurant(formData);

	// 		console.log('API Response:', response); // Debugging: Check API response in the console

	// 		if (response && response.status === true) {
	// 			toast.success(response.message, {position: 'top-center'});

	// 			// navigate('/dashboard/restaurant-info');
	// 		} else {
	// 			toast.error(response.message, {position: 'top-center'});
	// 		}
	// 	} catch (error) {
	// 		console.error('Error updating restaurant:', error);

	// 		const errorMessages = Object.values(error.response?.data?.errors || {})
	// 			.flat()
	// 			.join('\n');

	// 		setPopupContent(errorMessages || 'An error occurred while updating the restaurant.');
	// 		setIsPopupOpen(true);

	// 		// Show toast error message
	// 		toast.error('Error updating restaurant. Check the fields and try again.', {position: 'top-center'});
	// 	}
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validateFields();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		const formData = new FormData();
		formData.append('name', restaurantData.name);
		formData.append('email', restaurantData.email);
		formData.append('phone', restaurantData.phone);
		formData.append('website', restaurantData.website);
		formData.append('address', restaurantData.address);
		formData.append('post_code', restaurantData.post_code);
		formData.append('category', restaurantData.category);
		formData.append('status', restaurantData.status);
		formData.append('reservation_status', restaurantData.reservation_status);

		if (restaurantData.avatar) {
			formData.append('avatar', restaurantData.avatar);
		} else if (restaurantData.avatarPreview && !restaurantData.avatarPreview.startsWith('blob:')) {
			formData.append('avatar', restaurantData.avatarPreview.replace(imageBaseUrl, '')); // Keep API image
		}

		formData.append('uuid', id);
		formData.append('params', 'update');
		formData.append('updated_by', storeUser);

		try {
			const response = await createRestaurant(formData);

			if (response && response.status === true) {
				toast.success(response.message, {position: 'top-center'});
			} else {
				toast.error(response.message, {position: 'top-center'});
			}
		} catch (error) {
			console.error('Error updating restaurant:', error);
			setPopupContent('Error updating restaurant. Check the fields and try again.');
			setIsPopupOpen(true);
		}
	};

	useEffect(() => {
		return () => {
			if (restaurantData.avatar && restaurantData.avatar instanceof File) {
				URL.revokeObjectURL(restaurantData.avatar.preview);
			}
		};
	}, [restaurantData.avatar]);

	const {getRootProps, getInputProps} = useDropzone({
		onDrop: onSingleDrop,
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/gif': [],
			'image/bmp': [],
		},
		multiple: false,
		noClick: false, // Ensures clicking the area opens file manager
		noKeyboard: false, // Allows keyboard navigation
	});

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	const handleDropzoneClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<>
			<PageTitle title="Restaurant Edit" description="Home Page Description" />
			<div className="p-5 max-w-3xl mx-auto bg-white rounded shadow-md">
				<div className="flex flex-col gap-5">
					<div className="md:flex items-center justify-between space-y-5">
						<h1 className="text-2xl font-bold leading-none">Edit Restaurant</h1>
						<div className="flex items-center space-x-4">
							<button
								className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
								onClick={handleRestaurantList}
							>
								Restaurant List
							</button>
						</div>
					</div>
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="flex flex-col w-full">
								<label htmlFor="name" className="block text-sm font-medium text-gray-700">
									Restaurant Name <span className="text-red-500">*</span>
								</label>
								<InputField
									type="text"
									name="name"
									placeholder="Restaurant Name"
									value={restaurantData.name}
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
									value={restaurantData.email}
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
									value={restaurantData.phone}
									onChange={handleInputChange}
									error={errors.phone}
								/>
							</div>
							<div className="flex flex-col w-full">
								<label htmlFor="post_code" className="block text-sm font-medium text-gray-700">
									Post code <span className="text-red-500">*</span>
								</label>
								<InputField
									type="text"
									name="post_code"
									placeholder="Post code"
									value={restaurantData.post_code}
									onChange={handleInputChange}
									error={errors.post_code}
								/>
							</div>
							<div className="flex flex-col w-full">
								<label htmlFor="website" className="block text-sm font-medium text-gray-700">
									Website
								</label>
								<InputField
									type="text"
									name="website"
									placeholder="Website"
									value={restaurantData.website}
									onChange={handleInputChange}
									error={errors.website}
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
									value={restaurantData.address}
									onChange={handleInputChange}
									error={errors.address}
								/>
							</div>
							<div className="flex flex-col w-full">
								<label htmlFor="category" className="block text-sm font-medium text-gray-700">
									Category
								</label>
								<select
									name="category"
									value={restaurantData.category}
									onChange={handleInputChange}
									className={`border rounded p-2 text-base ${
										errors.category ? 'border-red-500' : 'border-gray-300'
									} focus:outline-none focus:shadow`}
								>
									<option value="">Select a category</option>
									{categoryData.map((category, index) => (
										<option key={index} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
								{errors.category && <span className="text-sm text-red-500">{errors.category}</span>}
							</div>
							<div className="flex flex-col w-full">
								<label htmlFor="status" className="block text-sm font-medium text-gray-700">
									Status
								</label>
								<select
									name="status"
									value={restaurantData.status}
									onChange={handleInputChange}
									className={`border rounded p-2 text-base ${
										errors.status ? 'border-red-500' : 'border-gray-300'
									} focus:outline-none focus:shadow`}
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
								{errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
							</div>
							{/* Reservation Acceptance Radio Buttons */}
							<div className="w-full mt-4">
								<label className="block text-sm font-medium text-gray-700">Reservation Acceptance</label>
								<div className="flex items-center space-x-4 mt-2">
									<label className="flex items-center space-x-2">
										<input
											type="radio"
											name="reservation_status"
											value="automatic"
											checked={restaurantData.reservation_status === 'automatic'}
											onChange={handleInputChange}
											className="form-radio text-blue-600 focus:ring focus:ring-blue-300"
										/>
										<span className="text-gray-700">Auto Accept</span>
									</label>

									<label className="flex items-center space-x-2">
										<input
											type="radio"
											name="reservation_status"
											value="manual"
											checked={restaurantData.reservation_status === 'manual'}
											onChange={handleInputChange}
											className="form-radio text-blue-600 focus:ring focus:ring-blue-300"
										/>
										<span className="text-gray-700">Manual Accept</span>
									</label>
								</div>
								{errors.reservation_status && <span className="text-sm text-red-500">{errors.reservation_status}</span>}
							</div>
						</div>

						<div className="mt-6">
							<label className="block text-sm font-medium text-gray-700">Upload Restaurant Image</label>
							<div
								{...getRootProps({onClick: handleDropzoneClick})}
								className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer"
							>
								{/* Ensure input is properly included and visible */}
								<input {...getInputProps()} ref={fileInputRef} style={{display: 'none'}} />

								{restaurantData.avatarPreview ? (
									<div className="h-48 w-48 m-auto relative">
										<img
											src={restaurantData.avatarPreview}
											alt="Restaurant Preview"
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

							{/* <div
								{...singleImageDropzone.getRootProps()}
								className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer"
								aria-label="Upload a single image"
							>
								<input {...singleImageDropzone.getInputProps()} ref={fileInputRef} />
								{restaurantData.avatar ? (
									<div className="h-48 w-48 m-auto relative">
										<img
											src={URL.createObjectURL(restaurantData.avatar)}
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
							</div> */}
						</div>

						<div className="mt-6 text-right">
							<button type="submit" className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover">
								Update Restaurant
							</button>
						</div>
					</form>
				</div>
			</div>

			<Toaster />
			<Popup isOpen={isPopupOpen} title="Error" content={popupContent} onClose={() => setIsPopupOpen(false)} />
		</>
	);
}
