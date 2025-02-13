import React, {useEffect, useState} from 'react';
import CustomButton from '../../../ui-share/CustomButton';
import {Cross, Edit} from '../../../ui-share/Icon';
import {usePopup} from './../../../hooks/usePopup';
import Popup from '../../../ui-share/Popup';
import InputField from '../../../ui-share/InputField';
import {useParams} from 'react-router-dom';
import {getRestaurantSearchTagList, postRestaurantSearchTag, restaurantAboutTag} from '../../../api';
import toast, {Toaster} from 'react-hot-toast';
import {useNavigate, useLocation} from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';

export default function RestaurantTag() {
	const [activeTab, setActiveTab] = useState('Search Tags');
	const [tagName, setTagName] = useState('');
	const [editTagName, setEditTagName] = useState('');
	const [editTagUUID, setEditTagUUID] = useState('');
	const [aboutTagName, setAboutTagName] = useState('');
	const [editAboutTagName, setEditAboutTagName] = useState('');
	const [editAboutTagUUID, setEditAboutTagUUID] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [restaurantSearchTagList, setRestaurantSearchTagList] = useState();
	const [aboutTagList, setAboutTagList] = useState();
	const [tagToDelete, setTagToDelete] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingTags, setLoadingTags] = useState(false);
	const {id} = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const {rest_name} = location.state || {};

	const addSearchTagPopup = usePopup();
	const editSearchTagPopup = usePopup();
	const searchTagDeletePopup = usePopup();

	const addAboutTagPopup = usePopup();
	const editAboutTagPopup = usePopup();
	const aboutTagDeletePopup = usePopup();

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	const validateInput = (value) => {
		const sqlInjectionPattern = /('|--|;|\/\*|\*\/|xp_)/i;
		if (!value) {
			return 'Tag Name is required.';
		} else if (sqlInjectionPattern.test(value)) {
			return 'Invalid characters detected.';
		} else {
			return '';
		}
	};

	useEffect(() => {
		fetchRestaurantSearchTagList();
		fetchAboutTagList();
	}, [id]);

	const fetchRestaurantSearchTagList = async () => {
		setLoadingTags(true); // Set loading state for fetching tags
		const data = {
			rest_uuid: id,
			params: 'info',
		};
		const response = await getRestaurantSearchTagList(data);
		setRestaurantSearchTagList(response.data.data);
		setLoadingTags(false); // Clear loading state after fetching tags
	};

	const fetchAboutTagList = async () => {
		setLoadingTags(true); // Set loading state for fetching tags
		const data = {
			rest_uuid: id,
			params: 'info',
		};
		const response = await restaurantAboutTag(data);
		setAboutTagList(response.data.data);
		setLoadingTags(false); // Clear loading state after fetching tags
	};

	// Functions for Search Tags
	const handleSearchFormSubmit = async (e) => {
		e.preventDefault();
		const error = validateInput(tagName);
		if (error) {
			setErrorMessage(error);
		} else {
			setLoading(true); // Set loading state for adding tags
			addSearchTagPopup.close();
			const data = {
				rest_uuid: id,
				status: 'active',
				name: tagName,
				params: 'create',
			};
			const response = await postRestaurantSearchTag(data);
			setLoading(false); // Clear loading state after adding tags
			setTagName('');
			if (response) {
				toast.success(response.data.message, {position: 'top-center'});
				await fetchRestaurantSearchTagList(); // Refresh the list of tags
			} else {
				toast.error(response.message, {position: 'top-center'});
			}
		}
	};

	const handleEditSearchFormSubmit = async (e) => {
		e.preventDefault();
		const error = validateInput(editTagName);
		if (error) {
			setErrorMessage(error);
		} else {
			setLoading(true); // Set loading state for editing tags
			editSearchTagPopup.close();
			try {
				const data = {
					rest_uuid: id,
					status: 'active',
					name: editTagName,
					params: 'update',
					uuid: editTagUUID,
				};
				const response = await postRestaurantSearchTag(data);
				setLoading(false); // Clear loading state after editing tags
				if (response && response.data.message) {
					toast.success('Tag updated successfully!', {position: 'top-center'});
					await fetchRestaurantSearchTagList(); // Refresh the list of tags
				} else {
					toast.error('Failed to update tag. Please try again.', {position: 'top-center'});
				}
			} catch (error) {
				setLoading(false); // Clear loading state if there's an error
				toast.error('An error occurred while updating the tag. Please try again.', {position: 'top-center'});
			}
		}
	};

	const handleSearchTagsDelete = (uuid) => {
		setTagToDelete(uuid);
		searchTagDeletePopup.open();
	};

	const confirmDeleteTag = async () => {
		if (!tagToDelete) return;

		setLoading(true); // Set loading state for deleting tags
		try {
			const data = {
				rest_uuid: id,
				params: 'delete',
				uuid: tagToDelete,
			};
			const response = await postRestaurantSearchTag(data);
			setLoading(false); // Clear loading state after deleting tags
			if (response) {
				toast.success(response.data.message, {position: 'top-center'});
				await fetchRestaurantSearchTagList(); // Refresh the list of tags
			} else {
				toast.error(response.massage, {position: 'top-center'});
			}
		} catch (error) {
			setLoading(false); // Clear loading state if there's an error
			toast.error('An error occurred while deleting the tag. Please try again.', {position: 'top-center'});
		} finally {
			searchTagDeletePopup.close();
			setTagToDelete(null);
		}
	};

	const handleEditSearchClick = (tag, uuid) => {
		setEditTagName(tag);
		setEditTagUUID(uuid);
		setErrorMessage('');
		editSearchTagPopup.open();
	};

	// Functions for About Tags
	const handleAboutFormSubmit = async (e) => {
		e.preventDefault();
		const error = validateInput(aboutTagName);
		if (error) {
			setErrorMessage(error);
		} else {
			setLoading(true); // Set loading state for adding about tags
			addAboutTagPopup.close();
			const data = {
				rest_uuid: id,
				status: 'active',
				name: aboutTagName,
				params: 'create',
			};
			const response = await restaurantAboutTag(data);
			setLoading(false); // Clear loading state after adding about tags
			setAboutTagName('');
			if (response) {
				toast.success(response.data.message, {position: 'top-center'});
				await fetchAboutTagList(); // Refresh the list of about tags
			} else {
				toast.error(response.message, {position: 'top-center'});
			}
		}
	};

	const handleEditAboutFormSubmit = async (e) => {
		e.preventDefault();
		const error = validateInput(editAboutTagName);
		if (error) {
			setErrorMessage(error);
		} else {
			setLoading(true); // Set loading state for editing about tags
			editAboutTagPopup.close();
			try {
				const data = {
					rest_uuid: id,
					status: 'active',
					name: editAboutTagName,
					params: 'update',
					uuid: editAboutTagUUID,
				};
				const response = await restaurantAboutTag(data);
				setLoading(false); // Clear loading state after editing about tags
				if (response && response.data.message) {
					toast.success('About tag updated successfully!', {position: 'top-center'});
					await fetchAboutTagList(); // Refresh the list of about tags
				} else {
					toast.error('Failed to update about tag. Please try again.', {position: 'top-center'});
				}
			} catch (error) {
				setLoading(false); // Clear loading state if there's an error
				toast.error('An error occurred while updating the about tag. Please try again.', {position: 'top-center'});
			}
		}
	};

	const handleAboutTagsDelete = (uuid) => {
		setTagToDelete(uuid);
		aboutTagDeletePopup.open();
	};

	const confirmDeleteAboutTag = async () => {
		if (!tagToDelete) return;

		setLoading(true); // Set loading state for deleting about tags
		try {
			const data = {
				rest_uuid: id,
				params: 'delete',
				uuid: tagToDelete,
			};
			const response = await restaurantAboutTag(data);
			console.log('response', response);
			setLoading(false); // Clear loading state after deleting about tags
			if (response) {
				toast.success(response?.data?.message, {position: 'top-center'});
				await fetchAboutTagList(); // Refresh the list of about tags
			} else {
				toast.error('Failed to delete about tag. Please try again.', {position: 'top-center'});
			}
		} catch (error) {
			setLoading(false); // Clear loading state if there's an error
			toast.error('An error occurred while deleting the about tag. Please try again.', {position: 'top-center'});
			console.error('Error deleting about tag:', error);
		} finally {
			aboutTagDeletePopup.close();
			setTagToDelete(null);
		}
	};

	const handleEditAboutClick = (tag, uuid) => {
		setEditAboutTagName(tag);
		setEditAboutTagUUID(uuid);
		setErrorMessage('');
		editAboutTagPopup.open();
	};

	// Updated handleInputChange functions
	const handleSearchInputChange = (e) => {
		setTagName(e.target.value);
		setErrorMessage('');
	};

	const handleEditSearchInputChange = (e) => {
		setEditTagName(e.target.value);
		setErrorMessage('');
	};

	const handleAboutInputChange = (e) => {
		setAboutTagName(e.target.value);
		setErrorMessage('');
	};

	const handleEditAboutInputChange = (e) => {
		setEditAboutTagName(e.target.value);
		setErrorMessage('');
	};

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	const renderTabContent = () => {
		if (loadingTags) {
			return <div>Loading...</div>; // Display loading indicator while fetching tags
		}
		if (activeTab === 'Search Tags') {
			return (
				<div className="flex flex-col gap-5">
					{restaurantSearchTagList && restaurantSearchTagList.length > 0 ? (
						<div className="flex items-center flex-wrap gap-5 py-4">
							{restaurantSearchTagList.map((tag, index) => (
								<span key={index} className="bg-white px-3 py-2 rounded-full shadow-md flex items-center gap-2">
									{tag.name}
									<Edit className="hover:text-button" onClick={() => handleEditSearchClick(tag.name, tag.uuid)} />
									<Cross className="hover:text-red-600" onClick={() => handleSearchTagsDelete(tag.uuid)} />
								</span>
							))}
						</div>
					) : (
						<p className="text-gray-500">Tag not found.</p>
					)}
					<CustomButton
						text="Add search tag"
						className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
						onClick={addSearchTagPopup.open}
						disabled={loading} // Disable button while loading
					/>
				</div>
			);
		} else if (activeTab === 'About Tags') {
			return (
				<div className="flex flex-col gap-5">
					{aboutTagList && aboutTagList.length > 0 ? (
						<div className="flex items-center flex-wrap gap-5 py-4">
							{aboutTagList.map((tag, index) => (
								<span key={index} className="bg-white px-3 py-2 rounded-full shadow-md flex items-center gap-2">
									{tag.name}
									<Edit className="hover:text-button" onClick={() => handleEditAboutClick(tag.name, tag.uuid)} />
									<Cross className="hover:text-red-600" onClick={() => handleAboutTagsDelete(tag.uuid)} />
								</span>
							))}
						</div>
					) : (
						<p className="text-gray-500">Tag not found.</p>
					)}
					<CustomButton
						text="Add about tag"
						className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
						onClick={addAboutTagPopup.open}
						disabled={loading} // Disable button while loading
					/>
				</div>
			);
		}
		return null;
	};

	return (
		<>
			<PageTitle title="Restaurant Tag" description="Home Page Description" />
			<div className="min-h-screen">
				<div className="container">
					<div className="max-w-[700px] mx-auto px-5">
						<div className="flex flex-col gap-5">
							<div className="flex justify-between">
								<h1 className="text-2xl font-bold">{rest_name} Tags</h1>
								<button
									className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
									onClick={handleRestaurantList}
								>
									Restaurant List
								</button>
							</div>

							<div className="flex items-center space-x-4 mb-4 overflow-x-scroll sm:overflow-x-hidden border-b">
								{['Search Tags', 'About Tags'].map((tab) => (
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
			</div>
			{/* Popups for Search Tags */}
			{addSearchTagPopup.isOpen && (
				<Popup
					title="Add Search Tag"
					isOpen={addSearchTagPopup.isOpen}
					onClose={addSearchTagPopup.close}
					content={
						<div className="">
							<form>
								<label className="block font-medium text-gray-700">Tag Name</label>
								<InputField
									type="text"
									value={tagName}
									onChange={handleSearchInputChange}
									placeholder="Enter tag name"
									name="tag"
									error={errorMessage}
								/>
								<div className="mt-4 flex justify-end">
									<CustomButton
										text="Save"
										className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
										type="submit"
										onClick={handleSearchFormSubmit}
										disabled={loading} // Disable button while loading
									/>
								</div>
							</form>
						</div>
					}
				/>
			)}
			{editSearchTagPopup.isOpen && (
				<Popup
					title="Edit Search Tag"
					isOpen={editSearchTagPopup.isOpen}
					onClose={editSearchTagPopup.close}
					content={
						<div>
							<form>
								<label className="block font-medium text-gray-700">Tag Name</label>
								<InputField
									type="text"
									value={editTagName}
									onChange={handleEditSearchInputChange}
									placeholder="Enter tag name"
									name="tag"
									error={errorMessage}
								/>
								<div className="mt-4 flex justify-end">
									<CustomButton
										text="Update"
										className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
										type="submit"
										onClick={handleEditSearchFormSubmit}
										disabled={loading} // Disable button while loading
									/>
								</div>
							</form>
						</div>
					}
				/>
			)}
			{searchTagDeletePopup.isOpen && (
				<Popup
					title="Confirm Delete"
					isOpen={searchTagDeletePopup.isOpen}
					onClose={() => {
						searchTagDeletePopup.close();
						setTagToDelete(null);
					}}
					content={
						<div>
							<p>Are you sure you want to delete this tag?</p>
							<div className="mt-4 flex justify-end gap-2">
								<CustomButton
									text="Cancel"
									className="bg-gray-300 text-black py-2 px-4 rounded-md"
									onClick={() => {
										searchTagDeletePopup.close();
										setTagToDelete(null);
									}}
								/>
								<CustomButton
									text="Delete"
									className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
									onClick={confirmDeleteTag}
									disabled={loading} // Disable button while loading
								/>
							</div>
						</div>
					}
				/>
			)}
			{/* Popups for About Tags */}
			{addAboutTagPopup.isOpen && (
				<Popup
					title="Add About Tag"
					isOpen={addAboutTagPopup.isOpen}
					onClose={addAboutTagPopup.close}
					content={
						<div>
							<form>
								<label className="block font-medium text-gray-700">Tag Name</label>
								<InputField
									type="text"
									value={aboutTagName}
									onChange={handleAboutInputChange}
									placeholder="Enter tag name"
									name="tag"
									error={errorMessage}
								/>
								<div className="mt-4 flex justify-end">
									<CustomButton
										text="Save"
										className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
										type="submit"
										onClick={handleAboutFormSubmit}
										disabled={loading} // Disable button while loading
									/>
								</div>
							</form>
						</div>
					}
				/>
			)}
			{editAboutTagPopup.isOpen && (
				<Popup
					title="Edit About Tag"
					isOpen={editAboutTagPopup.isOpen}
					onClose={editAboutTagPopup.close}
					content={
						<div>
							<form>
								<label className="block font-medium text-gray-700">Tag Name</label>
								<InputField
									type="text"
									value={editAboutTagName}
									onChange={handleEditAboutInputChange}
									placeholder="Enter tag name"
									name="tag"
									error={errorMessage}
								/>
								<div className="mt-4 flex justify-end">
									<CustomButton
										text="Update"
										className="bg-button hover:bg-buttonHover text-white py-2 px-4 rounded-md"
										type="submit"
										onClick={handleEditAboutFormSubmit}
										disabled={loading} // Disable button while loading
									/>
								</div>
							</form>
						</div>
					}
				/>
			)}
			{aboutTagDeletePopup.isOpen && (
				<Popup
					title="Confirm Delete"
					isOpen={aboutTagDeletePopup.isOpen}
					onClose={() => {
						aboutTagDeletePopup.close();
						setTagToDelete(null);
					}}
					content={
						<div>
							<p>Are you sure you want to delete this tag?</p>
							<div className="mt-4 flex justify-end gap-2">
								<CustomButton
									text="Cancel"
									className="bg-gray-300 text-black py-2 px-4 rounded-md"
									onClick={() => {
										aboutTagDeletePopup.close();
										setTagToDelete(null);
									}}
								/>
								<CustomButton
									text="Delete"
									className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
									onClick={confirmDeleteAboutTag}
									disabled={loading} // Disable button while loading
								/>
							</div>
						</div>
					}
				/>
			)}

			<Toaster />
		</>
	);
}
