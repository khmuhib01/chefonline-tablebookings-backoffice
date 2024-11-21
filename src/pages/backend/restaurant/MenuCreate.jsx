import React, {useEffect, useState} from 'react';
import CustomButton from './../../../ui-share/CustomButton';
import {Edit, Delete, DownArrow, UpArrow} from './../../../ui-share/Icon';
import Popup from '../../../ui-share/Popup';
import InputField from './../../../ui-share/InputField';
import ToggleSwitch from './../../../ui-share/ToggleSwitch';
import {createMenuItem, getMenuCategory} from '../../../api';
import {useSelector} from 'react-redux';
import toast, {Toaster} from 'react-hot-toast';
import {useParams, useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';

export default function MenuCreate() {
	const {id} = useParams();
	const location = useLocation();
	const {rest_name} = location.state || {};

	const navigate = useNavigate();

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

	const storeRestaurantUUID = useSelector((state) => state.user.user.res_uuid);

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

		// console.log('data', data);

		// return;

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

	const renderTabContent = () => (
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
									{category.name} ({menuItems?.filter((item) => item?.menu_category?.uuid === category.uuid)?.length})
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
					<div className="w-full flex items-center gap-3 justify-end mt-10">
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
					</div>
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
									className={`text-lg font-semibold text-button border-b-2 border-button`}
								>
									Menus and Items
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
