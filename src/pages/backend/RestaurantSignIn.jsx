import React, {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {postUserLogin} from './../../api';
import {useDispatch} from 'react-redux';
import {setUser, setAuthToken} from './../../store/reducers/userSlice';
import Spinner from './../../ui-share/Spinner';
import {setToken} from './../../utils/storage';
import {AuthContextRestaurant} from './../../context/AuthContextRestaurant';
import Popup from './../../ui-share/Popup'; // Import the Popup component
import PageTitle from '../../components/PageTitle';

export default function RestaurantSignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(''); // State to manage the error message
	const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control the popup visibility
	const {login} = useContext(AuthContextRestaurant);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let valid = true;

		// Validate email
		if (!email) {
			setEmailError('Email is required');
			valid = false;
		} else if (!validateEmail(email)) {
			setEmailError('Invalid email address');
			valid = false;
		} else {
			setEmailError('');
		}

		// Validate password
		if (!password) {
			setPasswordError('Password is required');
			valid = false;
		} else {
			setPasswordError('');
		}

		// If form is valid, proceed with submission
		if (valid) {
			try {
				const data = {
					email: email.trim(),
					password: password,
				};
				setLoading(true);
				const response = await postUserLogin(data);

				setLoading(false);

				if (response && response.data && response.data.status) {
					const userType = response.data.user_type;
					login(response, userType);

					// Store token securely
					setToken(response.token);

					// Update Redux state
					dispatch(setAuthToken(response.token));
					dispatch(setUser(response.data));

					// Clear form fields
					setEmail('');
					setPassword('');

					// Navigate based on user type
					if (userType === 'admin' || userType === 'staff') {
						navigate('/dashboard');
					} else if (userType === 'super_admin') {
						navigate('/dashboard');
					} else {
						navigate('/'); // Default route or home
					}
				} else {
					// Show error in popup
					setErrorMessage(response.data.message || 'An error occurred. Please try again.');
					setIsPopupOpen(true);
				}
			} catch (error) {
				// Handle unexpected errors
				setErrorMessage(error?.response?.data?.message || 'An unexpected error occurred. Please try again later.');
				setIsPopupOpen(true);
				setLoading(false);
			}
		}
	};

	const closePopup = () => {
		setIsPopupOpen(false);
	};

	return (
		<>
			<PageTitle title="Sign In" description="Home Page Description" />
			<div className="bg-[#F7F8FA] py-10 min-h-screen flex items-center justify-center">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h2 className="text-center text-2xl text-titleText font-bold">Restaurant Sign In</h2>
							<div className="max-w-[600px] mx-auto rounded-md w-full">
								<div className="flex flex-col gap-5">
									<div className="bg-white p-8 rounded-lg shadow-lg w-full border">
										<form onSubmit={handleSubmit}>
											<div className="mb-4">
												<label htmlFor="email" className="block text-gray-700 font-bold mb-2">
													Email address <span className="text-red-500">*</span>
												</label>
												<input
													type="email"
													className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
													placeholder="eg. john@gmail.com"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
												/>
												{emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
											</div>
											<div className="mb-4">
												<div className="relative">
													<label htmlFor="password" className="block text-gray-700 font-bold mb-2">
														Password <span className="text-red-500">*</span>
													</label>
													<input
														type={passwordVisible ? 'text' : 'password'}
														className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
														placeholder="Enter your password"
														value={password}
														onChange={(e) => setPassword(e.target.value)}
													/>
													<button
														type="button"
														className="absolute right-2 top-10 text-gray-500 hover:text-gray-700"
														onClick={togglePasswordVisibility}
													>
														{passwordVisible ? 'Hide' : 'Show'}
													</button>
													{passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
												</div>
											</div>
											{/* <div className="mb-4 flex justify-center gap-2 items-start">
												<p>I don't have an account</p>
												<Link to="/restaurant-sign-up" className="text-blue-500 hover:underline">
													Create an account?
												</Link>
											</div> */}

											<button
												type="submit"
												className="w-full p-2 bg-button text-white rounded-lg hover:bg-buttonHover flex justify-center items-center gap-x-3"
											>
												{loading ? <Spinner /> : null} Sign in
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Popup component for showing error messages */}
				<Popup isOpen={isPopupOpen} title="Login Error" content={errorMessage} onClose={closePopup} />
			</div>
		</>
	);
}
