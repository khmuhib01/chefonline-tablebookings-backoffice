import React, {useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import {Cross} from '../../../ui-share/Icon';
import Popup from './../../../ui-share/Popup'; // Import your Popup component
import {restaurantGallery} from '../../../api';
import {useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import {appConfig} from '../../../AppConfig';
import PageTitle from '../../../components/PageTitle';

export default function GalleryCreate() {
	const {id} = useParams();
	const [images, setImages] = useState([]);
	const [gallery, setGallery] = useState([]);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupContent, setPopupContent] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState({}); // To track loading status of each image

	const navigate = useNavigate();

	const imageBaseUrl = appConfig.baseUrl;

	const storeUser = useSelector((state) => state.user);

	const multiImageDropzone = useDropzone({
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/gif': [],
			'image/bmp': [],
		},
		multiple: true,
		onDrop: (acceptedFiles) => {
			setImages((prevImages) => [...prevImages, ...acceptedFiles]);
		},
	});

	const postGallery = async () => {
		setIsUploading(true);
		const newUploadStatus = {};

		for (const [index, file] of images.entries()) {
			const formData = new FormData();
			formData.append('rest_uuid', id);
			formData.append('avatar', file);
			formData.append('status', 'active');
			formData.append('params', 'create');

			newUploadStatus[index] = 'loading';
			setUploadStatus({...newUploadStatus});

			try {
				const response = await restaurantGallery(formData);
				newUploadStatus[index] = 'uploaded';
				fetchGallery();
			} catch (error) {
				console.error('Error creating gallery:', error);
				newUploadStatus[index] = 'error';
				setPopupContent('Error creating gallery. Please try again.');
				setIsPopupOpen(true);
				break; // Stop further uploads if there's an error
			}
		}

		setUploadStatus(newUploadStatus);
		setImages([]); // Clear images after upload
		setIsUploading(false);
	};

	const fetchGallery = async () => {
		const data = {rest_uuid: id, params: 'info'};
		try {
			const response = await restaurantGallery(data);
			setGallery(response.data);
		} catch (error) {
			console.error('Error fetching gallery:', error);
			setPopupContent('Error fetching gallery. Please try again.');
			setIsPopupOpen(true);
		}
	};

	useEffect(() => {
		fetchGallery();
	}, []);

	const handleRemoveImage = (indexToRemove, e) => {
		e.stopPropagation(); // Prevents triggering the file input click
		setImages(images.filter((_, index) => index !== indexToRemove));
	};

	const handleDeleteImage = async (uuid, e) => {
		e.stopPropagation();

		// Set loading status for the image being deleted
		setUploadStatus((prevStatus) => ({
			...prevStatus,
			[uuid]: 'loading',
		}));

		const data = {
			rest_uuid: id,
			uuid: uuid,
			params: 'delete',
		};

		try {
			const response = await restaurantGallery(data);
			fetchGallery();
		} catch (error) {
			console.error('Error deleting image:', error);
			setPopupContent('Error deleting image. Please try again.');
			setIsPopupOpen(true);
		} finally {
			// Remove loading status after the operation
			setUploadStatus((prevStatus) => {
				const newStatus = {...prevStatus};
				delete newStatus[uuid];
				return newStatus;
			});
		}
	};

	const handleRestaurantList = () => {
		navigate('/dashboard/restaurant-info');
	};

	return (
		<>
			<PageTitle title="Gallery Create" description="Home Page Description" />
			<div className="p-5 max-w-3xl mx-auto bg-white rounded shadow-md">
				<div className="flex flex-col gap-10">
					<div className="flex flex-col">
						<div className="md:flex items-center justify-between space-y-5">
							<h1 className="text-2xl font-bold leading-none">Uploaded Images</h1>

							<div className="flex items-center space-x-4">
								<button
									className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover w-full md:w-auto"
									onClick={handleRestaurantList}
								>
									Restaurant List
								</button>
							</div>
						</div>
						<form onSubmit={(e) => e.preventDefault()}>
							<div className="flex flex-wrap gap-2 w-full">
								{gallery.length > 0 ? (
									gallery.map((image, index) => (
										<div key={index} className="flex items-center gap-2 flex-wrap">
											<div className="relative">
												{uploadStatus[image.uuid] === 'loading' ? (
													<div className="h-32 w-32 rounded-md bg-white p-2 shadow-md flex items-center justify-center">
														<p>Loading...</p>
													</div>
												) : (
													<>
														<img
															src={imageBaseUrl + image.avatar}
															alt={image.name}
															className="h-32 w-32 rounded-md bg-white p-2 shadow-md object-cover"
														/>
														<button
															type="button"
															className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500"
															aria-label="Remove image"
															onClick={(e) => handleDeleteImage(image.uuid, e)}
														>
															<Cross className="h-5 w-5 bg-white shadow-md rounded-full" />
														</button>
													</>
												)}
											</div>
										</div>
									))
								) : (
									<p>No images found.</p>
								)}
							</div>
						</form>
					</div>
					<div className="flex flex-col gap-5">
						<div className="md:flex items-center justify-between space-y-5">
							<h1 className="text-2xl font-bold leading-none">Upload Images</h1>
						</div>
						<form onSubmit={(e) => e.preventDefault()}>
							<div className="flex flex-col w-full">
								<label className="block text-sm font-medium text-gray-700">Upload Restaurant Images</label>
								<div
									{...multiImageDropzone.getRootProps()}
									className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer"
									aria-label="Upload multiple images"
								>
									<input {...multiImageDropzone.getInputProps()} disabled={isUploading} />
									{images.length > 0 ? (
										<div className="flex items-center gap-2 flex-wrap">
											{images.map((file, index) => (
												<div key={index} className="relative">
													{uploadStatus[index] === 'loading' ? (
														<div className="h-32 w-32 rounded-md bg-white p-2 shadow-md flex items-center justify-center">
															<p>Loading...</p>
														</div>
													) : (
														<img
															src={URL.createObjectURL(file)}
															alt={`Preview ${index + 1}`}
															className="h-32 w-32 rounded-md bg-white p-2 shadow-md object-cover"
														/>
													)}
													{uploadStatus[index] !== 'loading' && (
														<button
															type="button"
															onClick={(e) => handleRemoveImage(index, e)}
															className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500"
															aria-label="Remove image"
														>
															<Cross className="h-5 w-5 bg-white shadow-md rounded-full" />
														</button>
													)}
												</div>
											))}
										</div>
									) : (
										<p>Drag & drop images here, or click to select files</p>
									)}
								</div>
							</div>

							<div className="mt-6 text-right">
								<button
									className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover"
									onClick={postGallery}
									disabled={isUploading}
								>
									{isUploading ? 'Uploading...' : 'Upload Images'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<Popup isOpen={isPopupOpen} title="Error" content={popupContent} onClose={() => setIsPopupOpen(false)} />
		</>
	);
}
