import React from 'react';
import {Link} from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

export default function RestaurantSignUp() {
	return (
		<>
			<PageTitle title="Sign Up" description="Home Page Description" />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-y-10">
				<div className="flex flex-col gap-5 w-full max-w-[800px]">
					<div className="flex flex-col gap-y-5">
						<h2 className="text-center text-4xl font-bold">Get started</h2>
						{/* <img src="images/logo.png" alt="rest_01" className="m-auto" /> */}
						<p className="text-center text-bodyText text-xl">
							Join our 15,000+ restaurant partners. Leave your contact details in the form below and we’ll get in touch
							with you soon.
						</p>
					</div>
					<div className="h-[1px] bg-gray-200"></div>
					<div className="grid grid-cols-2 gap-y-3">
						<div className="md:col-span-1 col-span-2">
							<h3 className="text-center text-xl font-bold">Already a TableBooking partner?</h3>
							{/* <button
							className="bg-button text-white p-2 rounded-lg hover:bg-buttonHover"
							onClick={() => (window.location.href = '/restaurant-sign-in')}
						>
							Log in
						</button> */}

							<Link to="/restaurant-sign-in" className="text-blue-500 text-center block">
								Log in
							</Link>
						</div>
						<div className="md:col-span-1 col-span-2">
							<h3 className="text-center text-xl font-bold">Need help with a reservation?</h3>
							<Link to="https://restaurant.tablebookings.co.uk/contact" className="text-blue-500 text-center block">
								Contact us
							</Link>
						</div>
					</div>
				</div>

				<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
					<h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
					<form className="w-full flex flex-col gap-y-4">
						<div className="grid grid-cols-12 gap-4 flex-wrap w-full">
							<div className="md:col-span-6 col-span-12">
								<label className="block text-gray-700">
									First name<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
									placeholder="Enter your first name"
									required
								/>
							</div>
							<div className="md:col-span-6 col-span-12">
								<label className="block text-gray-700">
									First name<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
									placeholder="Enter your first name"
									required
								/>
							</div>
						</div>
						<div className="grid grid-cols-12 gap-4 flex-wrap w-full">
							<div className="md:col-span-6 col-span-12">
								<label className="block text-gray-700">
									Email address<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
									placeholder="Enter your first name"
									required
								/>
							</div>
							<div className="md:col-span-6 col-span-12">
								<label className="block text-gray-700">
									Phone<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
									placeholder="Enter your first name"
									required
								/>
							</div>
						</div>
						<div className="grid grid-cols-12 gap-4 flex-wrap w-full">
							<div className="md:col-span-6 col-span-12">
								<label className="block text-gray-700">
									City<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
									placeholder="Enter your first name"
									required
								/>
							</div>
							<div className="md:col-span-6 col-span-12">
								<label className="block text-gray-700">
									Postal Code<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
									placeholder="Enter your first name"
									required
								/>
							</div>
						</div>
						<div className="grid grid-cols-12 gap-2 flex-wrap w-full">
							<div className="col-span-12">
								<label className="block text-gray-700">
									Restaurant Name<span className="text-red-500">*</span>
								</label>
								<input
									type="password"
									className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
									placeholder="Enter your first name"
									required
								/>
							</div>
						</div>
						<div className="grid grid-cols-12 gap-2 flex-wrap w-full">
							<div className="col-span-12">
								<input type="checkbox" className="mr-2 leading-tight" />
								<label className="text-gray-700">
									By submitting this form, I agree to TableBooking
									<Link
										to="https://restaurant.tablebookings.co.uk/terms-and-conditions"
										className="text-blue-500 hover:underline"
									>
										Terms and Conditions
									</Link>
									and
									<Link
										to="https://restaurant.tablebookings.co.uk/privacy-policy"
										className="text-blue-500 hover:underline"
									>
										Privacy Policy
									</Link>
									.*
								</label>
							</div>
						</div>
						<div className="grid grid-cols-12 gap-2 flex-wrap w-full">
							<div className="col-span-12">
								<input type="checkbox" className="mr-2 leading-tight" />
								<label className="text-gray-700">
									I agree to receive email newsletters and marketing communication from Quandoo. I understand that I can
									unsubscribe at any time.
								</label>
							</div>
						</div>

						<button type="submit" className="w-full bg-button text-white p-2 rounded-lg hover:bg-buttonHover">
							Submit
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
