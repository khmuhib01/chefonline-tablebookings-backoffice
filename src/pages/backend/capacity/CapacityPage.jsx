import React, {useContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import PopupForm from './PopupForm';
import {usePopup} from './../../../hooks/usePopup';
import {useParams, useNavigate} from 'react-router-dom';
import {
	getFloorData,
	postFloorDelete,
	createFloor,
	updateFloor,
	createTable,
	getTablesData,
	deleteTableData,
	updateTable,
} from '../../../api';
import CustomButton from './../../../ui-share/CustomButton';
import {Edit, Delete, DownArrow, UpArrow} from './../../../ui-share/Icon';
import Popup from '../../../ui-share/Popup';
import toast, {Toaster} from 'react-hot-toast';
import {AuthContextRestaurant} from './../../../context/AuthContextRestaurant';
import {useLocation} from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';

export default function CapacityPage() {
	const {id} = useParams();
	const location = useLocation();
	const {rest_name} = location.state || {};
	const navigate = useNavigate();
	const [floorData, setFloorData] = useState([]);
	const [tableData, setTableData] = useState({});
	const [floorId, setFloorId] = useState('');
	const [activeTab, setActiveTab] = useState('Floor and tables');
	const [activeIndex, setActiveIndex] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		minCapacity: '',
		maxCapacity: '',
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);

	const storeRestaurantUUID = useSelector((state) => state.user.user.res_uuid);

	const {isAuthenticated, userType} = useContext(AuthContextRestaurant);

	const addAreaPopup = usePopup();
	const editAreaPopup = usePopup();
	const deleteAreaPopup = usePopup();

	const addTablePopup = usePopup();
	const editTablePopup = usePopup();
	const deleteTablePopup = usePopup();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {rest_uuid: id, params: 'info'};
				const fetchFloorData = await getFloorData(data);
				setLoading(false);
				setFloorData(fetchFloorData.data);
			} catch (error) {
				console.error('Error fetching floor data:', error);
				setLoading(false);
				toast.error('Error fetching floor data.', {position: 'top-center'});
			}
		};

		fetchData();
	}, [id]);

	useEffect(() => {
		if (floorId) {
			fetchTableData(floorId);
		}
	}, [floorId]);

	const fetchTableData = async (floorUuid) => {
		try {
			setTableLoading(true);
			const data = {rest_uuid: id, floor_uuid: floorUuid, params: 'info'};
			const fetchTableData = await getTablesData(data);

			setTableData((prevTableData) => ({
				...prevTableData,
				[floorUuid]: fetchTableData.data,
			}));
			// toast.success('Table data fetched successfully.', {position: 'bottom-right'});
		} catch (error) {
			console.error('Error fetching table data:', error);
			// toast.error('Error fetching table data.', {position: 'bottom-right'});
		} finally {
			setTableLoading(false);
		}
	};

	const handleSetActiveIndex = (index, floorUuid) => {
		if (activeIndex === index) {
			setActiveIndex(null);
		} else {
			setActiveIndex(index);
			setFloorId(floorUuid);
			fetchTableData(floorUuid);
		}
	};

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		setErrors({...errors, [name]: ''});
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name) {
			newErrors.name = 'Name is required';
		}

		if (addTablePopup.isOpen || editTablePopup.isOpen) {
			if (!formData.minCapacity) {
				newErrors.minCapacity = 'Minimum capacity is required';
			}

			if (!formData.maxCapacity) {
				newErrors.maxCapacity = 'Maximum capacity is required';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSaveArea = async () => {
		if (!validateForm()) {
			return;
		}

		const data = {
			name: formData.name,
			rest_uuid: id,
			params: editAreaPopup.currentId ? 'update' : 'create',
			uuid: editAreaPopup.currentId,
		};

		try {
			setLoading(true);
			if (editAreaPopup.currentId) {
				await updateFloor(data);
				editAreaPopup.close();
				toast.success('Floor updated successfully!', {position: 'top-center'});
			} else {
				await createFloor(data);
				addAreaPopup.close();
				toast.success('Floor added successfully!', {position: 'top-center'});
			}
			const fetchFloorData = await getFloorData({rest_uuid: id, params: 'info'});
			setFloorData(fetchFloorData.data);
		} catch (error) {
			console.error('Error saving floor:', error);
			toast.error('Failed to save floor. Please try again.', {position: 'top-center'});
		} finally {
			setLoading(false);
		}
	};

	const handleSaveTable = async () => {
		if (!validateForm()) {
			return;
		}

		const data = {
			rest_uuid: id,
			table_id: Math.floor(Math.random() * 90) + 10,
			floor_uuid: floorId,
			capacity: formData.maxCapacity,
			min_seats: formData.minCapacity,
			max_seats: formData.maxCapacity,
			reservation_online: 'yes',
			status: 'active',
			table_name: formData.name,
			params: editTablePopup.currentId ? 'update' : 'create',
			uuid: editTablePopup.currentId,
		};

		try {
			setLoading(true);
			if (editTablePopup.currentId) {
				await updateTable(data);
				editTablePopup.close();
				toast.success('Table updated successfully!', {position: 'top-center'});
			} else {
				await createTable(data);
				addTablePopup.close();
				toast.success('Table added successfully!', {position: 'top-center'});
			}
			await fetchTableData(floorId);
		} catch (error) {
			console.error('Error saving table:', error);
			toast.error('Failed to save table. Please try again.', {position: 'top-center'});
		} finally {
			setLoading(false);
		}
	};

	const handleAreaDelete = async () => {
		if (!deleteAreaPopup.currentId) return;

		try {
			await postFloorDelete({params: 'delete', uuid: deleteAreaPopup.currentId});
			deleteAreaPopup.close();
			toast.success('Floor deleted successfully!', {position: 'top-center'});
			const fetchFloorData = await getFloorData({rest_uuid: id, params: 'info'});
			setFloorData(fetchFloorData.data);
		} catch (error) {
			console.error('Error deleting floor:', error);
			toast.error('Failed to delete floor. Please try again.', {position: 'top-center'});
		}
	};

	const handleTableDelete = async () => {
		if (!deleteTablePopup.currentId) return;

		try {
			setTableLoading(true);
			await deleteTableData({
				params: 'delete',
				uuid: deleteTablePopup.currentId,
				floor_uuid: floorId,
				rest_uuid: id,
			});

			deleteTablePopup.close();
			toast.success('Table deleted successfully!', {position: 'top-center'});
			await fetchTableData(floorId);
		} catch (error) {
			console.error('Error deleting table:', error);
			toast.error('Failed to delete table. Please try again.', {position: 'top-center'});
		} finally {
			setTableLoading(false);
		}
	};

	const handleEditAreaOpen = (uuid) => {
		const areaToEdit = floorData.find((area) => area.uuid === uuid);
		if (areaToEdit) {
			setFormData({name: areaToEdit.name, minCapacity: '', maxCapacity: ''});
		}
		editAreaPopup.open(uuid);
	};

	const handleEditTableOpen = (uuid) => {
		const tableToEdit = tableData[floorId]?.find((table) => table.uuid === uuid);
		if (tableToEdit) {
			setFormData({
				name: tableToEdit.table_name,
				minCapacity: tableToEdit.min_seats,
				maxCapacity: tableToEdit.max_seats,
			});
		}
		editTablePopup.open(uuid);
	};

	const renderTabContent = () => {
		if (activeTab === 'Floor and tables') {
			return (
				<div className="flex flex-col gap-5">
					<p className="text-bodyText">Manage seating capacity with the floor and tables you define.</p>
					<CustomButton
						text="Add Floor"
						className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md max-w-[120px]"
						onClick={() => {
							setFormData({name: '', minCapacity: '', maxCapacity: ''});
							addAreaPopup.open();
						}}
					/>
					<div className="flex flex-col gap-5">
						{loading ? (
							<div>Loading...</div>
						) : floorData && floorData.length > 0 ? (
							floorData.map((item, index) => (
								<div key={item.uuid}>
									<button
										onClick={() => handleSetActiveIndex(index, item.uuid)}
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
											{item.name}
										</div>
										<span className="flex gap-2">
											<Edit size={22} className="text-bodyText" onClick={() => handleEditAreaOpen(item.uuid)} />
											<Delete size={22} className="text-bodyText" onClick={() => deleteAreaPopup.open(item.uuid)} />
										</span>
									</button>
									{activeIndex === index && (
										<>
											<div className="bg-white p-3 flex flex-col gap-2">
												{tableLoading ? (
													<p className="text-gray-500 p-3">Loading tables...</p>
												) : tableData[item.uuid] && tableData[item.uuid].length > 0 ? (
													tableData[item.uuid]?.map((table) => (
														<div key={table.uuid} className="flex items-center justify-between">
															<div className="">
																<p className="text-bodyText font-bold">{table.table_name}</p>
																<span className="text-bodyText text-xs">
																	{table.min_seats}-{table.max_seats} seats -{' '}
																	<span className="text-green-600">{table.reservation_online}</span>
																</span>
															</div>
															<div className="flex gap-2">
																<Edit
																	size={22}
																	className="text-bodyText"
																	onClick={() => handleEditTableOpen(table.uuid)}
																/>
																<Delete
																	size={22}
																	className="text-bodyText"
																	onClick={() => deleteTablePopup.open(table.uuid)}
																/>
															</div>
														</div>
													))
												) : (
													<p className="text-gray-500 p-3">No tables found</p>
												)}
												<CustomButton
													text="Add Table"
													className="border border-button hover:bg-buttonHover text-button hover:text-white py-2 px-4 rounded-md max-w-[120px]"
													onClick={() => {
														setFormData({name: '', minCapacity: '', maxCapacity: ''});
														setFloorId(item.uuid);
														addTablePopup.open();
													}}
												/>
											</div>
										</>
									)}
								</div>
							))
						) : (
							<div className="">No data found</div>
						)}
					</div>
				</div>
			);
		} else if (activeTab === 'Combinations') {
			return <div>Combinations</div>;
		}
		return null;
	};

	const handleAddAvailabilityButtonClick = () => {
		navigate('/dashboard/availability/' + id);
	};

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	return (
		<>
			<PageTitle title="Capacity" description="Home Page Description" />
			<div className="min-h-screen">
				<div className="container">
					<div className="max-w-[700px] mx-auto px-5">
						<div className="flex flex-col gap-5">
							<div className="flex items-center justify-between">
								<h1 className="text-2xl font-bold">{rest_name} Floor and tables setup</h1>
								<div className="flex items-center space-x-4">
									<button
										className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
										onClick={handleRestaurantList}
									>
										Restaurant List
									</button>
								</div>
								{/* {isAuthenticated && userType === 'super_admin' && (
									<button
										className="bg-button text-white p-2 rounded-lg hover:bg-buttonHover focus:outline-none focus:ring-2"
										onClick={() => navigate('/dashboard/restaurant-info')} // Corrected this line
									>
										Restaurant List
									</button>
								)} */}
							</div>

							<div className="flex items-center space-x-4 mb-4 overflow-x-scroll sm:overflow-x-hidden border-b">
								{['Floor and tables'].map((tab) => (
									<button
										key={tab}
										onClick={() => setActiveTab(tab)}
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
				</div>
			</div>

			{addAreaPopup.isOpen && (
				<PopupForm
					title="Add Floor"
					formData={formData}
					handleInputChange={handleInputChange}
					handleSave={handleSaveArea}
					handleClose={addAreaPopup.close}
					loading={loading}
					errors={errors}
				/>
			)}

			{editAreaPopup.isOpen && (
				<PopupForm
					title="Edit Floor"
					formData={formData}
					handleInputChange={handleInputChange}
					handleSave={handleSaveArea}
					handleClose={editAreaPopup.close}
					loading={loading}
					errors={errors}
				/>
			)}

			{addTablePopup.isOpen && (
				<PopupForm
					title="Add Table"
					formData={formData}
					handleInputChange={handleInputChange}
					handleSave={handleSaveTable}
					handleClose={addTablePopup.close}
					loading={loading}
					errors={errors}
					isTable
				/>
			)}

			{editTablePopup.isOpen && (
				<PopupForm
					title="Edit Table"
					formData={formData}
					handleInputChange={handleInputChange}
					handleSave={handleSaveTable}
					handleClose={editTablePopup.close}
					loading={loading}
					errors={errors}
					isTable
				/>
			)}

			{deleteAreaPopup.isOpen && (
				<Popup
					isOpen={deleteAreaPopup.isOpen}
					title="Confirm Floor Deletion"
					content={
						<div className="p-4">
							<p>Are you sure you want to delete this floor? This action cannot be undone.</p>
							<div className="flex justify-end gap-4 mt-4">
								<CustomButton
									text="Cancel"
									className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md"
									onClick={deleteAreaPopup.close}
								/>
								<CustomButton
									text="Delete"
									className="bg-red-600 text-white py-2 px-4 rounded-md"
									onClick={handleAreaDelete}
								/>
							</div>
						</div>
					}
					onClose={deleteAreaPopup.close}
				/>
			)}

			{deleteTablePopup.isOpen && (
				<Popup
					isOpen={deleteTablePopup.isOpen}
					title="Confirm Table Deletion"
					content={
						<div className="p-4">
							<p>Are you sure you want to delete this table? This action cannot be undone.</p>
							<div className="flex justify-end gap-4 mt-4">
								<CustomButton
									text="Cancel"
									className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md"
									onClick={deleteTablePopup.close}
								/>
								<CustomButton
									text="Delete"
									className="bg-red-600 text-white py-2 px-4 rounded-md"
									onClick={handleTableDelete}
								/>
							</div>
						</div>
					}
					onClose={deleteTablePopup.close}
				/>
			)}

			<Toaster />
		</>
	);
}
