import React, {useEffect, useState} from 'react';
import CustomButton from './../../../ui-share/CustomButton';
import {Edit, Delete, DownArrow, UpArrow} from './../../../ui-share/Icon';
import Popup from '../../../ui-share/Popup';
import InputField from './../../../ui-share/InputField';
import ToggleSwitch from './../../../ui-share/ToggleSwitch';
import {createMenuItem, getMenuCategory, restaurantMenuImageOrPdf} from '../../../api';
import {useSelector} from 'react-redux';
import toast, {Toaster} from 'react-hot-toast';
import {useParams, useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';
import {appConfig} from '../../../AppConfig';

export default function MenuCreate() {
	const {id} = useParams();
	const location = useLocation();
	const {rest_name} = location.state || {};

	const navigate = useNavigate();

	const baseUrl = appConfig.baseUrl;

	const [activeTab, setActiveTab] = useState('Menus and Items');
	const [activeIndex, setActiveIndex] = useState(null);
	const [isAddMenuItemPopupOpen, setIsAddMenuItemPopupOpen] = useState(false);
	const [isEditMenuItemPopupOpen, setIsEditMenuItemPopupOpen] = useState(false);
	const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [categoryId, setCategoryId] = useState(null);
	const [menuCategory, setMenuCategory] = useState([]);
	const [menuItems, setMenuItems] = useState([]);
	const [toggleChecked, setToggleChecked] = useState(true);

	const [name, setName] = useState('');
	const [itemDescription, setItemDescription] = useState('');
	const [price, setPrice] = useState('');
	const [selectedItemId, setSelectedItemId] = useState(null);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [uploadedFiles, setUploadedFiles] = useState([]);

	const [deleteImageOrPdfFile, setDeleteImageOrPdfFile] = useState(null); // File to delete
	const [isDeleteImageOrPdfPopupOpen, setIsDeleteImageOrPdfPopupOpen] = useState(false);

	const storeRestaurantUUID = useSelector((state) => state.user.user.res_uuid);

	// console.log('setActiveTab', activeTab);

	const fetchMenuCategories = async () => {
		setIsLoading(true);
		try {
			const response = await getMenuCategory();
			setMenuCategory(response.data);
		} catch (error) {
			toast.error('Error fetching menu categories.', {position: 'top-center'});
		} finally {
			setIsLoading(false);
		}
	};

	const fetchMenuItems = async () => {
		setIsLoading(true);
		try {
			const response = await createMenuItem({
				rest_uuid: id,
				params: 'info',
			});
			setMenuItems(response.data);
		} catch (error) {
			toast.error('Error fetching menu items.', {position: 'top-center'});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchMenuCategories();
		fetchMenuItems();
	}, [id]);

	const handleSetActiveIndex = (index) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleItemDescriptionChange = (event) => {
		setItemDescription(event.target.value);
	};

	const handlePriceChange = (event) => {
		setPrice(event.target.value);
	};

	const handleToggleChange = () => {
		setToggleChecked(!toggleChecked);
	};

	const validateInputs = () => {
		if (!name || !itemDescription || !price) {
			toast.error('All fields are required.', {position: 'top-center'});
			return false;
		}

		if (!/^[a-zA-Z0-9\s\-.,!@#\$%\^&\*]+$/.test(name) || !/^[a-zA-Z0-9\s\-.,!@#\$%\^&\*]+$/.test(itemDescription)) {
			toast.error('Invalid characters in the input.', {position: 'top-center'});
			return false;
		}

		if (isNaN(price) || price <= 0) {
			toast.error('Price must be a positive number.', {position: 'top-center'});
			return false;
		}

		return true;
	};

	const handleMenuItemSave = async () => {
		if (!validateInputs()) return;

		const data = {
			name: name,
			description: itemDescription,
			price: price,
			category_uuid: categoryId,
			rest_uuid: id,
			status: toggleChecked ? 'active' : 'inactive',
			global_description: itemDescription,
			symbol: '₹',
		};

		setIsLoading(true);
		try {
			if (selectedItemId) {
				await createMenuItem({...data, uuid: selectedItemId, params: 'update'});
				toast.success('Menu item updated successfully!', {position: 'top-center'});
			} else {
				await createMenuItem({...data, params: 'create'});
				toast.success('Menu item created successfully!', {position: 'top-center'});
			}

			fetchMenuItems();

			setIsAddMenuItemPopupOpen(false);
			setIsEditMenuItemPopupOpen(false);
			setName('');
			setItemDescription('');
			setPrice('');
			setSelectedItemId(null);
		} catch (error) {
			toast.error('Failed to save menu item. Please try again.', {position: 'top-center'});
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditItem = (item) => {
		setSelectedItemId(item.uuid);
		setName(item.name);
		setItemDescription(item.description);
		setPrice(item.price);
		setToggleChecked(item.status === 'active');
		setCategoryId(item.menu_category.uuid);
		setIsEditMenuItemPopupOpen(true);
	};

	const handleDeleteItem = async () => {
		const data = {
			rest_uuid: id,
			uuid: selectedItemId,
			params: 'delete',
		};
		setIsLoading(true);
		try {
			await createMenuItem(data);
			toast.success('Menu item deleted successfully!', {position: 'top-center'});

			fetchMenuItems();

			setIsDeletePopupOpen(false);
			setSelectedItemId(null);
		} catch (error) {
			toast.error('Failed to delete menu item. Please try again.', {position: 'top-center'});
		} finally {
			setIsLoading(false);
		}
	};

	const fetchUploadedFiles = async () => {
		setIsLoading(true);
		try {
			const response = await restaurantMenuImageOrPdf({
				params: 'info',
				rest_uuid: id,
			});

			setUploadedFiles(response.data); // Assuming `response.data` contains the array of files
		} catch (error) {
			console.error('Error fetching uploaded files:', error);
			toast.error('Failed to fetch uploaded files.', {position: 'top-center'});
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const previewUrl = URL.createObjectURL(file); // Create a preview URL
			setUploadedFile({
				file, // Original file
				preview: previewUrl, // Preview URL
				type: file.type, // File type (image/pdf)
			});
		}
	};

	const openDeletePopup = (file) => {
		setDeleteImageOrPdfFile(file);
		setIsAddMenuItemPopupOpen(true);
	};

	// Call fetchUploadedFiles when the tab is opened
	useEffect(() => {
		if (activeTab === 'Menu Image or Pdf Upload') {
			fetchUploadedFiles();
		}
	}, [activeTab]);

	useEffect(() => {
		return () => {
			if (uploadedFile) {
				URL.revokeObjectURL(uploadedFile.preview); // Clean up URL
			}
		};
	}, [uploadedFile]);

	const handleUpload = async () => {
		setIsLoading(true);
		const data = {
			rest_uuid: id,
			params: 'create',
			image: uploadedFile.file,
			status: 'active',
		};

		try {
			const response = await restaurantMenuImageOrPdf(data);
			// console.log('response', response);
			toast.success(response.message, {position: 'top-center'});
			fetchMenuItems();
			fetchUploadedFiles();
			setUploadedFile(null);
		} catch (error) {
			toast.error('Failed to upload file. Please try again.', {position: 'top-center'});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteImageOrPdf = async () => {
		if (!deleteImageOrPdfFile) return;

		setIsLoading(true);
		const data = {
			rest_uuid: id,
			params: 'delete',
			uuid: deleteImageOrPdfFile.uuid,
		};

		try {
			// API call to delete the file
			await restaurantMenuImageOrPdf(data);

			// console.log('deleteImageOrPdfFile', data);

			// return;

			// Remove the deleted file from the state
			setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.uuid !== deleteImageOrPdfFile.uuid));

			toast.success('File deleted successfully.', {position: 'top-center'});
		} catch (error) {
			console.error('Error deleting file:', error);
			toast.error('Failed to delete file. Please try again.', {
				position: 'top-center',
			});
		} finally {
			setIsLoading(false);
			setIsDeleteImageOrPdfPopupOpen(false); // Close the popup
			setDeleteImageOrPdfFile(null); // Reset the file
		}
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case 'Menus and Items':
				return (
					<div className="flex flex-col gap-5">
						<p className="text-bodyText">Manage your menu and items here.</p>

						{isLoading ? (
							<div>Loading...</div>
						) : (
							<div className="flex flex-col gap-5">
								{menuCategory?.map((category, index) => (
									<div key={category.id}>
										<button
											onClick={() => handleSetActiveIndex(index)}
											className={`text-lg flex justify-between items-center w-full bg-white p-3 ${
												activeIndex === index ? 'font-semibold text-button border-b-2 border-button' : 'text-gray-500'
											}`}
										>
											<div className="flex items-center gap-2">
												{activeIndex === index ? (
													<UpArrow size={22} className="text-bodyText" />
												) : (
													<DownArrow size={22} className="text-bodyText" />
												)}
												{category.name} (
												{menuItems?.filter((item) => item?.menu_category?.uuid === category.uuid)?.length})
											</div>
										</button>
										{activeIndex === index && (
											<div className="bg-white p-3 flex flex-col gap-2">
												{menuItems
													?.filter((item) => item?.menu_category?.uuid === category.uuid)
													.map((item) => (
														<div key={item.id} className="flex items-center justify-between">
															<div>
																<p className="text-bodyText font-bold">{item.name}</p>
																<span className="text-bodyText text-xs">
																	{item.description} - <span className="text-green-600">₹{item.price}</span>
																</span>
															</div>
															<div className="flex gap-2">
																<Edit size={22} className="text-bodyText" onClick={() => handleEditItem(item)} />
																<Delete
																	size={22}
																	className="text-bodyText"
																	onClick={() => {
																		setSelectedItemId(item.uuid);
																		setIsDeletePopupOpen(true);
																	}}
																/>
															</div>
														</div>
													))}
												<CustomButton
													text="Add Menu"
													className="border border-button hover:bg-buttonHover text-button hover:text-white py-2 px-4 rounded-md max-w-[120px]"
													onClick={() => {
														setIsAddMenuItemPopupOpen(true);
														setCategoryId(category.uuid);
													}}
													disabled={isLoading}
												/>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				);
			case 'Menu Image or Pdf Upload':
				return (
					<div className="flex flex-col gap-5">
						<h2 className="text-xl font-bold">Upload Menu Images or PDF</h2>
						<p>Here you can upload images or PDFs of your menu items or categories.</p>

						{/* File Upload Section */}
						<div className="flex justify-between gap-5">
							<input
								type="file"
								accept="image/*,application/pdf"
								className="border p-2 w-full"
								onChange={(e) => handleFileUpload(e)}
							/>
							<button
								className={`border border-button text-button hover:bg-buttonHover hover:text-white py-2 px-4 rounded-md ${
									!uploadedFile ? 'opacity-50 cursor-not-allowed' : ''
								}`}
								onClick={handleUpload}
								disabled={!uploadedFile || isLoading} // Disable when no file is selected or loading
							>
								{isLoading ? 'Uploading...' : 'Upload'}
							</button>
						</div>

						{/* Display Currently Uploaded File Preview */}
						{uploadedFile && (
							<div className="mt-5">
								{uploadedFile.type.startsWith('image/') ? (
									<img src={uploadedFile.preview} alt="Uploaded Preview" className="w-48 h-48 object-cover border" />
								) : (
									<a
										href={uploadedFile.preview}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 underline"
									>
										View Uploaded PDF
									</a>
								)}
							</div>
						)}

						{/* Display Previously Uploaded Files */}
						<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{uploadedFiles.map((file) => (
								<div key={file.uuid} className="relative border p-2 rounded">
									{/* Cross/Delete Button */}
									<button
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
										onClick={() => {
											setDeleteImageOrPdfFile(file); // Set the file to delete
											setIsDeleteImageOrPdfPopupOpen(true); // Open the delete popup
										}}
									>
										&times;
									</button>

									{file.image.endsWith('.pdf') ? (
										<a
											href={`${baseUrl}${file.image}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 underline"
										>
											View PDF
										</a>
									) : (
										<img
											src={`${baseUrl}${file.image}`}
											alt="Uploaded Preview"
											className="w-full h-48 object-cover rounded"
										/>
									)}
								</div>
							))}
						</div>

						{/* Delete Confirmation Popup */}
						{isDeleteImageOrPdfPopupOpen && (
							<Popup
								isOpen={isDeleteImageOrPdfPopupOpen}
								title="Confirm Deletion"
								content={
									<div className="flex flex-col gap-5">
										<p>Are you sure you want to delete this file?</p>
										<div className="w-full flex items-center gap-3 justify-end mt-10">
											<CustomButton
												text="Delete"
												className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
												onClick={handleDeleteImageOrPdf}
												disabled={isLoading}
											/>
											<CustomButton
												text="Cancel"
												className="border border-button text-button hover:bg-buttonHover hover:text-white py-2 px-4 rounded-md"
												onClick={() => {
													setIsDeleteImageOrPdfPopupOpen(false); // Close the popup
													setDeleteImageOrPdfFile(null); // Reset the file
												}}
												disabled={isLoading}
											/>
										</div>
									</div>
								}
								onClose={() => {
									setIsDeleteImageOrPdfPopupOpen(false); // Close the popup
									setDeleteImageOrPdfFile(null); // Reset the file
								}}
							/>
						)}

						{/* Display Previously Uploaded Files */}
						{/* <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{uploadedFiles.map((file) => (
								<div key={file.uuid} className="relative border p-2 rounded">
									
									<button
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
										onClick={() => {
											setDeleteImageOrPdfFile(file); // Set the file to delete
											setIsDeleteImageOrPdfPopupOpen(true); // Open the delete popup
										}}
									>
										&times;
									</button>

									{file.image.endsWith('.pdf') ? (
										<a
											href={`${baseUrl}${file.image}`} // Use `baseUrl` here
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 underline"
										>
											View PDF
										</a>
									) : (
										<img
											src={`${baseUrl}${file.image}`} // Use `baseUrl` here
											alt="Uploaded Preview"
											className="w-full h-48 object-cover rounded"
										/>
									)}
								</div>
							))}
						</div> */}
					</div>
				);
			default:
				return null;
		}
	};

	const renderPopupForm = ({title, isMenuItem}) => (
		<Popup
			isOpen
			title={title}
			content={
				<div className="flex flex-col gap-5 min-w-[350px]">
					<InputField
						type="text"
						name="name"
						placeholder={`${title.split(' ')[0]} name`}
						value={name}
						onChange={handleNameChange}
						disabled={isLoading}
					/>
					{isMenuItem && (
						<>
							<InputField
								type="text"
								name="item_description"
								placeholder="Description"
								value={itemDescription}
								onChange={handleItemDescriptionChange}
								disabled={isLoading}
							/>
							<InputField
								type="number"
								name="price"
								placeholder="Price"
								value={price}
								onChange={handlePriceChange}
								disabled={isLoading}
							/>
						</>
					)}
					<div className="flex items-center justify-between gap-5">
						<div>
							<h5 className="text-titleText font-bold">Reservable online</h5>
							<p className="text-sm text-bodyText">
								Make this {isMenuItem ? 'menu item' : 'menu'} available for online reservations.
							</p>
						</div>
						<ToggleSwitch checked={toggleChecked} onChange={handleToggleChange} disabled={isLoading} />
					</div>
					<div className="w-full flex items-center gap-3 justify-end mt-10">
						<CustomButton
							text={'Save'}
							className="border border-button text-button hover:bg-buttonHover hover:text-white py-2 px-4 rounded-md"
							onClick={handleMenuItemSave}
							disabled={isLoading}
						/>
						<CustomButton
							text="Cancel"
							className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
							onClick={() => {
								setIsEditMenuItemPopupOpen(false);
								setIsAddMenuItemPopupOpen(false);
								setName('');
								setItemDescription('');
								setPrice('');
								setSelectedItemId(null);
							}}
							disabled={isLoading}
						/>
					</div>
				</div>
			}
			onClose={() => {
				setIsEditMenuItemPopupOpen(false);
				setIsAddMenuItemPopupOpen(false);
				setName('');
				setItemDescription('');
				setPrice('');
				setSelectedItemId(null);
			}}
		/>
	);

	const renderDeletePopup = () => (
		<Popup
			isOpen={isDeletePopupOpen}
			title="Confirm Deletion"
			content={
				<div className="flex flex-col gap-5">
					<p>Are you sure you want to delete this menu item?</p>
					<div className="flex items-center space-x-4 mb-4 overflow-x-scroll sm:overflow-x-hidden border-b">
						<button
							onClick={() => setActiveTab('Menus and Items')}
							className={`text-lg font-semibold ${
								activeTab === 'Menus and Items' ? 'text-button border-b-2 border-button' : 'text-gray-500'
							}`}
						>
							Menus and Items
						</button>
						<button
							onClick={() => setActiveTab('Menu Image or Pdf Upload')}
							className={`text-lg font-semibold ${
								activeTab === 'Menu Image or Pdf Upload' ? 'text-button border-b-2 border-button' : 'text-gray-500'
							}`}
						>
							Menu Image or Pdf Upload
						</button>
					</div>

					{/* <div className="w-full flex items-center gap-3 justify-end mt-10">
						<CustomButton
							text="Delete"
							className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
							onClick={handleDeleteItem}
							disabled={isLoading}
						/>
						<CustomButton
							text="Cancel"
							className="border border-button text-button hover:bg-buttonHover hover:text-white py-2 px-4 rounded-md"
							onClick={() => setIsDeletePopupOpen(false)}
							disabled={isLoading}
						/>
					</div> */}
				</div>
			}
			onClose={() => setIsDeletePopupOpen(false)}
		/>
	);

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	return (
		<>
			<PageTitle title="Menu Create" description="Home Page Description" />
			<div className="min-h-screen">
				<div className="container">
					<div className="max-w-[700px] mx-auto px-5">
						<div className="flex flex-col gap-5">
							<div className="flex justify-between items-center">
								<h1 className="text-2xl font-bold">{rest_name} Menu and items setup</h1>
								<div className="flex items-center space-x-4">
									<button
										className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
										onClick={handleRestaurantList}
									>
										Restaurant List
									</button>
								</div>
							</div>

							<div className="flex items-center space-x-4 mb-4 overflow-x-scroll sm:overflow-x-hidden border-b">
								<button
									onClick={() => setActiveTab('Menus and Items')}
									className={`text-lg font-semibold ${
										activeTab === 'Menus and Items' ? 'text-button border-b-2 border-button' : 'text-gray-500'
									}`}
								>
									Menus and Items
								</button>
								<button
									onClick={() => setActiveTab('Menu Image or Pdf Upload')}
									className={`text-lg font-semibold ${
										activeTab === 'Menu Image' ? 'text-button border-b-2 border-button' : 'text-gray-500'
									}`}
								>
									Menu Image
								</button>
							</div>
							{renderTabContent()}
						</div>
					</div>
				</div>
			</div>

			{isAddMenuItemPopupOpen && renderPopupForm({title: 'Menu item add', isMenuItem: true})}
			{isEditMenuItemPopupOpen && renderPopupForm({title: 'Menu item edit', isMenuItem: true})}
			{renderDeletePopup()}

			<Toaster />
		</>
	);
}
