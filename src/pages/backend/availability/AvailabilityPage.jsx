import React, {useContext, useEffect, useState} from 'react';
import {usePopup} from './../../../hooks/usePopup';
import CustomButton from './../../../ui-share/CustomButton';
import {Edit, Delete} from './../../../ui-share/Icon';
import {getTimeSlot, createRestaurantSlot, deleteTimeSlot, deleteIndividualSlot} from '../../../api';
import {useSelector} from 'react-redux';
import Popup from '../../../ui-share/Popup';
import toast, {Toaster} from 'react-hot-toast';
import {useParams, useNavigate} from 'react-router-dom';
import {AuthContextRestaurant} from './../../../context/AuthContextRestaurant';
import {useLocation} from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';

export default function AvailabilityPage() {
	const {id} = useParams();
	const location = useLocation();
	const {rest_name} = location.state || {};
	const [activeTab, setActiveTab] = useState('Reservation hours');
	const [restaurantTimeSlot, setRestaurantTimeSlot] = useState({});
	const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		day: '',
		start: '',
		end: '',
		id: null,
		uuid: null,
	});
	const [selectedDays, setSelectedDays] = useState([]);
	const [timeRanges, setTimeRanges] = useState([{start: '00:00', end: '01:00', uuid: null}]);
	const [deleteSlotInfo, setDeleteSlotInfo] = useState(null);

	const addHoursPopup = usePopup();
	const editHoursPopup = usePopup();
	const deleteConfirmationPopup = usePopup();

	const storeRestaurantUUID = useSelector((state) => state.user.user.res_uuid);

	const navigate = useNavigate();

	const {isAuthenticated, userType} = useContext(AuthContextRestaurant);

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	const handleAddHours = () => {
		setFormData({day: '', start: '', end: ''});
		setSelectedDays([]);
		setTimeRanges([{start: '00:00', end: '01:00', uuid: null}]);
		addHoursPopup.open();
	};

	const handleSaveHours = (newHours) => {
		const updatedTimeSlot = {...restaurantTimeSlot};
		if (editHoursPopup.isOpen) {
			const daySlots = updatedTimeSlot[formData.day];
			const slotIndex = daySlots.findIndex((slot) => slot.id === formData.id);
			if (slotIndex >= 0) {
				daySlots[slotIndex] = {...daySlots[slotIndex], ...newHours};
				setRestaurantTimeSlot(updatedTimeSlot);
			}
			editHoursPopup.close();
		} else {
			if (!updatedTimeSlot[formData.day]) {
				updatedTimeSlot[formData.day] = [];
			}
			updatedTimeSlot[formData.day].push(newHours);
			setRestaurantTimeSlot(updatedTimeSlot);
			addHoursPopup.close();
			checkIfAllDaysCovered(updatedTimeSlot);
		}
	};

	const handleDeleteHours = (day, slotId) => {
		const updatedTimeSlot = {...restaurantTimeSlot};
		updatedTimeSlot[day] = updatedTimeSlot[day].filter((slot) => slot.id !== slotId);
		if (updatedTimeSlot[day].length === 0) {
			delete updatedTimeSlot[day];
		}
		setRestaurantTimeSlot(updatedTimeSlot);
		checkIfAllDaysCovered(updatedTimeSlot);
	};

	const fetchTimeSlot = async () => {
		setIsLoading(true);
		const data = {
			rest_id: id,
		};

		try {
			const response = await getTimeSlot(data);

			if (response.data) {
				setRestaurantTimeSlot(response.data);
				checkIfAllDaysCovered(response.data);
			} else {
				setRestaurantTimeSlot({});
			}
		} catch (error) {
			console.error('Error fetching time slots:', error);
			toast.error('Error fetching time slots. Please try again.', {position: 'top-center'});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTimeSlot();
	}, []);

	const convertTo12HourFormat = (time) => {
		if (!time) return 'Invalid Time';

		const [hour, minute] = time.split(':');
		const hourNumber = parseInt(hour, 10);
		const period = hourNumber >= 12 ? 'PM' : 'AM';
		const adjustedHour = hourNumber % 12 || 12;
		return `${adjustedHour}:${minute} ${period}`;
	};

	const handleEditHours = (day, slots) => {
		setFormData({
			day,
			start: slots[0]?.slot_start || '',
			end: slots[0]?.slot_end || '',
			id: slots[0]?.id || null,
			uuid: slots[0]?.uuid || null,
		});
		setSelectedDays([day]); // Only show the selected day
		const timeRangesData = slots.map((slot) => ({
			start: slot.slot_start,
			end: slot.slot_end,
			uuid: slot.uuid, // Ensure uuid is included
		}));
		setTimeRanges(timeRangesData.length ? timeRangesData : [{start: '00:00', end: '01:00', uuid: null}]);
		editHoursPopup.open();
	};

	const handleDeleteClick = (day, slotInfo) => {
		setDeleteSlotInfo({day, slotInfo});
		deleteConfirmationPopup.open();
	};

	const confirmDelete = async () => {
		if (deleteSlotInfo) {
			const {day, slotInfo} = deleteSlotInfo;

			const data = {
				rest_id: id,
				day: day,
				slot_id: slotInfo?.id,
			};

			try {
				await deleteTimeSlot(data);
				fetchTimeSlot();
				handleDeleteHours(day, slotInfo.id);
				toast.success('Reservation hours deleted successfully!', {position: 'top-center'});
			} catch (error) {
				console.error('Error deleting time slot:', error);
				toast.error('Error deleting time slot. Please try again.', {position: 'top-center'});
			}
		}
		deleteConfirmationPopup.close();
	};

	const checkIfAllDaysCovered = (timeSlotData) => {
		const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
		const hasSlotsForAllDays = allDays.every((day) => timeSlotData[day]?.length > 0);
		setIsAddButtonDisabled(hasSlotsForAllDays);
	};

	const renderTabContent = () => {
		if (activeTab === 'Reservation hours') {
			return (
				<div className="flex flex-col gap-3">
					<p className="text-bodyText">Hours set here determine when you're accepting online reservations.</p>
					<p className="text-bodyText text-xs">Reservation hours are independent of your opening hours.</p>
					<div className="flex items-center gap-2">
						<CustomButton
							text="Add hours"
							className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
							onClick={handleAddHours}
							disabled={isAddButtonDisabled}
						/>
					</div>

					{(isLoading && <div>Loading...</div>) ||
						(Object.keys(restaurantTimeSlot).length === 0 && (
							<div className="bg-white p-3 rounded-md">No time slots found</div>
						)) || (
							<div className="flex flex-col gap-3">
								{Object?.entries(restaurantTimeSlot).map(([day, slots], dayIndex) => (
									<div key={`${day}-${dayIndex}`} className="bg-white p-3 rounded-md">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold capitalize">{day}</h3>
											<div className="flex gap-2">
												<Edit
													size={22}
													className="text-bodyText cursor-pointer"
													onClick={() => handleEditHours(day, slots)}
												/>
												<Delete
													size={22}
													className="text-bodyText cursor-pointer"
													onClick={() => handleDeleteClick(day, slots[0])}
												/>
											</div>
										</div>

										{slots?.map((slot, slotIndex) => (
											<div key={slot.id || slotIndex} className="flex justify-between items-center">
												<div>
													<p className="text-sm text-gray-500">
														{convertTo12HourFormat(slot?.slot_start)} - {convertTo12HourFormat(slot?.slot_end)}
													</p>
												</div>
											</div>
										))}
									</div>
								))}
							</div>
						)}
				</div>
			);
		} else if (activeTab === 'Adjustments') {
			return <div>Adjustments content goes here...</div>;
		}
		return null;
	};

	const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	const timeOptions = Array.from({length: 96}, (_, i) => {
		const hours24 = Math.floor(i / 4);
		const minutes = String((i % 4) * 15).padStart(2, '0');
		const period = hours24 >= 12 ? 'PM' : 'AM';
		const hours12 = hours24 % 12 || 12; // Convert 24-hour format to 12-hour format
		return `${hours12}:${minutes} ${period}`;
	});

	const availableDays = daysOfWeek.filter((day) => !Object.keys(restaurantTimeSlot).includes(day));

	const toggleDaySelection = (day) => {
		setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
	};

	const handleTimeChange = (index, field, value) => {
		const newTimeRanges = [...timeRanges];
		newTimeRanges[index][field] = value;
		setTimeRanges(newTimeRanges);
	};

	const addTimeRange = () => {
		if (timeRanges.length < 3) {
			setTimeRanges([...timeRanges, {start: '00:00', end: '01:00', uuid: null}]); // Add new range with null uuid
		}
	};

	const removeTimeRange = async (index) => {
		const removedRange = timeRanges[index];

		if (!removedRange.uuid) {
			toast.error('Unable to remove: Invalid UUID', {position: 'top-center'});
			return;
		}

		try {
			const data = {uuid: removedRange.uuid};
			const response = await deleteIndividualSlot(data);

			if (response) {
				// Remove the time range from the state only if the deletion was successful
				const newTimeRanges = timeRanges.filter((_, i) => i !== index);
				setTimeRanges(newTimeRanges);

				// Fetch the updated time slots and show success toast
				await fetchTimeSlot();
				toast.success('Shift deleted successfully', {position: 'top-center'});
			} else {
				throw new Error('Deletion failed');
			}
		} catch (error) {
			console.error('Error deleting shift:', error);
			toast.error('Something went wrong', {position: 'top-center'});
		}
	};

	const convertTo24HourFormat = (time) => {
		// Convert "hh:mm AM/PM" to "HH:mm" (24-hour format)
		const [timePart, modifier] = time.split(' ');
		let [hours, minutes] = timePart.split(':');

		if (modifier === 'PM' && hours !== '12') {
			hours = String(parseInt(hours, 10) + 12);
		} else if (modifier === 'AM' && hours === '12') {
			hours = '00'; // Midnight case
		}

		return `${hours.padStart(2, '0')}:${minutes}`;
	};

	const createApiData = (selectedDays, timeRanges) => {
		const apiData = selectedDays
			.map((day) => {
				return timeRanges.map((range) => {
					const start24 = convertTo24HourFormat(range.start);
					const end24 = convertTo24HourFormat(range.end);

					// Ensure end time is valid and <= 24:00
					if (timeStringToMinutes(end24) > 1440) {
						toast.error('End time cannot be after 24:00.', {position: 'top-center'});
						return null;
					}

					return {
						day: day.toLowerCase(),
						rest_uuid: id,
						slot_start: start24,
						slot_end: end24,
						interval_time: 15,
						status: 'active',
						uuid: range.uuid,
					};
				});
			})
			.flat()
			.filter(Boolean); // Remove null values (invalid times)

		return apiData;
	};

	// Convert time string "HH:MM" to minutes since midnight
	const timeStringToMinutes = (time) => {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	};

	// Validate if all end times are greater than start times
	const validateTimeRanges = (timeRanges) => {
		for (const range of timeRanges) {
			const startMinutes = timeStringToMinutes(range.start);
			const endMinutes = timeStringToMinutes(range.end);

			if (startMinutes >= endMinutes) {
				return false; // Invalid if start time is not less than end time
			}
		}
		return true; // All time ranges are valid
	};

	const handleAddHoursModalSave = async () => {
		// Validate time ranges first
		if (!validateTimeRanges(timeRanges)) {
			toast.error('End time must be greater than start time for all time ranges.', {position: 'top-center'});
			return; // Stop the function if validation fails
		}

		const formDataToSave = createApiData(selectedDays, timeRanges);

		try {
			// Loop through and save the data
			for (const data of formDataToSave) {
				await createRestaurantSlot(data);
			}
			handleSaveHours(formDataToSave);
			fetchTimeSlot();
			toast.success('Reservation hours added successfully!', {position: 'top-center'});
		} catch (error) {
			console.error('API Error:', error);
			toast.error('Error saving reservation hours. Please try again.', {position: 'top-center'});
		} finally {
			addHoursPopup.close();
		}
	};

	const handleEditHoursModalSave = async () => {
		// Validate time ranges first
		if (!validateTimeRanges(timeRanges)) {
			toast.error('End time must be greater than start time for all time ranges.', {position: 'top-center'});
			return; // Stop the function if validation fails
		}

		const formDataToSave = createApiData(selectedDays, timeRanges);

		try {
			// Loop through and save the data
			for (const data of formDataToSave) {
				await createRestaurantSlot(data);
			}
			handleSaveHours(formDataToSave);
			fetchTimeSlot();
			toast.success('Reservation hours updated successfully!', {position: 'top-center'});
		} catch (error) {
			console.error('API Error:', error);
			toast.error('Error updating reservation hours. Please try again.', {position: 'top-center'});
		} finally {
			editHoursPopup.close();
		}
	};

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	return (
		<>
			<PageTitle title="Availability" description="Home Page Description" />
			<div className="min-h-screen">
				<div className="container">
					<div className="max-w-[700px] mx-auto px-5">
						<div className="flex flex-col gap-5">
							<div className="flex justify-between items-center">
								<h1 className="text-2xl font-bold">{rest_name} Availability</h1>
								<div className="flex items-center space-x-4">
									{isAuthenticated && userType === 'super_admin' && (
										<button
											className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
											onClick={handleRestaurantList} // Corrected this line
										>
											Restaurant List
										</button>
									)}
								</div>
							</div>

							<div className="flex items-center space-x-4 overflow-x-scroll sm:overflow-x-hidden border-b">
								{['Reservation hours'].map((tab) => (
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
				</div>

				<Popup
					isOpen={addHoursPopup.isOpen}
					onClose={addHoursPopup.close}
					title="Add reservation hours"
					content={
						<div className="rounded-lg max-w-md mx-auto flex flex-col gap-5">
							<p className="text-gray-700 mb-4">Select the days where these hours will apply.</p>
							<div className="flex flex-wrap gap-2 mb-4">
								{availableDays.map((day) => (
									<button
										key={day}
										onClick={() => toggleDaySelection(day)}
										className={`px-3 py-1 rounded-full border capitalize ${
											selectedDays.includes(day) ? 'bg-button text-white' : 'bg-gray-200 text-gray-800'
										}`}
									>
										{day}
									</button>
								))}
							</div>

							{timeRanges.map((range, index) => (
								<div key={index} className="flex gap-2 mb-2 items-center">
									<div className="flex-1">
										<label className="block text-sm font-medium text-gray-700">Starts</label>
										<select
											value={range.start}
											onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
											className="custom-select"
										>
											{timeOptions.map((time, timeIndex) => (
												<option key={`start-${index}-${timeIndex}`} value={time}>
													{time}
												</option>
											))}
										</select>
									</div>
									<div className="flex-1">
										<label className="block text-sm font-medium text-gray-700">Ends</label>
										<select
											value={range.end}
											onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
											className="custom-select"
										>
											{timeOptions.map((time, timeIndex) => (
												<option key={`end-${index}-${timeIndex}`} value={time}>
													{time}
												</option>
											))}
										</select>
									</div>
									{timeRanges.length > 1 && (
										<button onClick={() => removeTimeRange(index)} className="text-red-500 text-sm ml-2">
											Remove
										</button>
									)}
								</div>
							))}

							{timeRanges.length < 3 && (
								<div className="">
									<p onClick={addTimeRange} className="text-blue-500 cursor-pointer">
										+ Add another time range
									</p>
									<span className="text-gray-500 text-xs">Note: You can add up to 3 time ranges.</span>
								</div>
							)}

							<div className="flex justify-end gap-2 mt-4">
								<CustomButton
									text="Save"
									className="bg-button hover:bg-buttonHover text-white px-4 py-2 rounded"
									onClick={handleAddHoursModalSave}
								/>
								<CustomButton
									text="Cancel"
									className="border px-4 py-2 rounded hover:border-button hover:text-button"
									onClick={addHoursPopup.close}
								/>
							</div>
						</div>
					}
				/>

				<Popup
					isOpen={editHoursPopup.isOpen}
					onClose={editHoursPopup.close}
					title="Edit reservation hours"
					content={
						<div className="rounded-lg max-w-md mx-auto flex flex-col gap-5">
							<p className="text-gray-700 mb-4">Select the days where these hours will apply.</p>
							<div className="flex flex-wrap gap-2 mb-4">
								<button key={formData.day} className={`px-3 py-1 rounded-full border capitalize bg-button text-white`}>
									{formData.day}
								</button>
							</div>

							{timeRanges.map((range, index) => (
								<div key={index} className="flex gap-2 mb-2 items-center">
									<div className="flex-1">
										<label className="block text-sm font-medium text-gray-700">Starts</label>
										<select
											value={range.start}
											onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
											className="custom-select"
										>
											{timeOptions.map((time, timeIndex) => (
												<option key={`start-${index}-${timeIndex}`} value={time}>
													{time}
												</option>
											))}
										</select>
									</div>
									<div className="flex-1">
										<label className="block text-sm font-medium text-gray-700">Ends</label>
										<select
											value={range.end}
											onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
											className="custom-select"
										>
											{timeOptions.map((time, timeIndex) => (
												<option key={`end-${index}-${timeIndex}`} value={time}>
													{time}
												</option>
											))}
										</select>
									</div>
									{timeRanges.length > 1 && (
										<button onClick={() => removeTimeRange(index)} className="text-red-500 text-sm ml-2">
											Remove
										</button>
									)}
								</div>
							))}

							{timeRanges.length < 3 && (
								<div className="">
									<p onClick={addTimeRange} className="text-blue-500 cursor-pointer">
										+ Add another time range
									</p>
									<span className="text-gray-500 text-xs">Note: You can add up to 3 time ranges.</span>
								</div>
							)}

							<div className="flex justify-end gap-2 mt-4">
								<CustomButton
									text="Save"
									className="bg-button hover:bg-buttonHover text-white px-4 py-2 rounded"
									onClick={handleEditHoursModalSave}
								/>
								<CustomButton
									text="Cancel"
									className="border px-4 py-2 rounded hover:border-button hover:text-button"
									onClick={editHoursPopup.close}
								/>
							</div>
						</div>
					}
				/>

				<Popup
					isOpen={deleteConfirmationPopup.isOpen}
					onClose={deleteConfirmationPopup.close}
					title="Confirm Deletion"
					content={
						<div className="rounded-lg max-w-md mx-auto flex flex-col gap-5">
							<p className="text-gray-700 mb-4">Are you sure you want to delete this time slot?</p>
							<div className="flex justify-end gap-2">
								<CustomButton
									text="Delete"
									className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
									onClick={confirmDelete}
								/>
								<CustomButton
									text="Cancel"
									className="border px-4 py-2 rounded hover:border-button hover:text-button"
									onClick={deleteConfirmationPopup.close}
								/>
							</div>
						</div>
					}
				/>

				<Toaster />
			</div>
		</>
	);
}
