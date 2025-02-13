import React, {useState, useEffect, useRef} from 'react';
import {useDropzone} from 'react-dropzone';
import {Cross} from '../../../ui-share/Icon';
import {useNavigate} from 'react-router-dom';
import InputField from './../../../ui-share/InputField'; // Adjust the import path as needed
import {useSelector} from 'react-redux';
import {createRestaurant, getCategoryData} from '../../../api';
import toast, {Toaster} from 'react-hot-toast';
import Popup from './../../../ui-share/Popup'; // Import your Popup component
import PageTitle from '../../../components/PageTitle';
import Spinner from './../../../ui-share/Spinner';

export default function RestaurantCreate() {
	const [restaurantData, setRestaurantData] = useState({
		name: '',
		email: '',
		phone: '',
		website: '',
		address: '',
		post_code: '',
		category: '',
		status: '',
		avatar: null,
		reservation_status: '',
	});
	const [categoryData, setCategoryData] = useState([]);
	const [errors, setErrors] = useState({});
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupContent, setPopupContent] = useState('');
	const [loading, setLoading] = useState(false); // New loading state
	const fileInputRef = useRef(null);

	const navigate = useNavigate();
	const storeRestaurantUUID = useSelector((state) => state.user.user.res_uuid);
	const storeUser = useSelector((state) => state.user.user.uuid);

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
		if (!restaurantData.post_code) newErrors.post_code = 'Post code is required';
		if (!restaurantData.reservation_status)
			newErrors.reservation_status = 'Please select a reservation acceptance type'; // <-- Validation for auto/manual accept
		return newErrors;
	};

	const onSingleDrop = (acceptedFiles) => {
		const file = acceptedFiles[0];
		if (file) {
			setRestaurantData({...restaurantData, avatar: file});
		} else {
			console.error('File format not supported');
		}
	};

	const handleRemoveSingleImage = () => {
		setRestaurantData({...restaurantData, avatar: null});
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validateFields();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append('name', restaurantData.name);
		formData.append('email', restaurantData.email);
		formData.append('phone', restaurantData.phone);
		formData.append('website', restaurantData.website);
		formData.append('address', restaurantData.address);
		formData.append('post_code', restaurantData.post_code);
		formData.append('category', restaurantData.category);
		formData.append('status', restaurantData.status);
		formData.append('reservation_status', restaurantData.reservation_status); // <-- Added field for submission
		formData.append('avatar', restaurantData.avatar);
		formData.append('uuid', storeRestaurantUUID);
		formData.append('params', 'create');
		formData.append('created_by', storeUser);

		try {
			console.log('restaurantData', restaurantData);
			// return;
			const response = await createRestaurant(formData);
			if (response) {
				toast.success('Restaurant created successfully!', {position: 'top-center'});
				setRestaurantData({
					name: '',
					email: '',
					phone: '',
					website: '',
					address: '',
					post_code: '',
					category: '',
					status: '',
					avatar: null,
					reservation_status: '',
				});
			} else {
				toast.error('Failed to create restaurant', {position: 'top-center'});
			}
		} catch (error) {
			console.error('Error creating restaurant:', error);
			const errorMessages = Object.values(error.response?.data?.errors || {})
				.flat()
				.join('\n');
			setPopupContent(errorMessages || 'An error occurred while creating the restaurant.');
			setIsPopupOpen(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (restaurantData.avatar) {
				URL.revokeObjectURL(restaurantData.avatar);
			}
		};
	}, [restaurantData.avatar]);

	const singleImageDropzone = useDropzone({
		onDrop: onSingleDrop,
		accept: {'image/jpeg': [], 'image/png': [], 'image/gif': [], 'image/bmp': []},
		multiple: false,
	});

	const handleUserCreateButtonClick = () => {
		navigate('/dashboard/user-create/' + storeRestaurantUUID);
	};

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	return (
		<>
			<PageTitle title="Restaurant Create" description="Home Page Description" />
			<div className="p-5 max-w-3xl mx-auto bg-white rounded shadow-md">
				<div className="flex flex-col gap-5">
					<div className="md:flex items-center justify-between space-y-5">
						<h1 className="text-2xl font-bold leading-none">Restaurant Create</h1>
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
							</div>
						</div>

						<div className="mt-6 text-right">
							<button
								type="submit"
								className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover flex justify-center items-center gap-x-3 float-right"
							>
								{loading ? <Spinner /> : null} Create Restaurant
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
