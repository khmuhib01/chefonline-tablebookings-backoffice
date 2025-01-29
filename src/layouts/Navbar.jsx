import React, {useState, useEffect, useRef, useContext} from 'react';
import {CiMenuFries} from 'react-icons/ci';
import {RxCross2} from 'react-icons/rx';
import {Link, useNavigate} from 'react-router-dom';
import {BiBookAlt} from 'react-icons/bi';
import {FaAngleRight} from 'react-icons/fa6';
import {IoIosLogOut} from 'react-icons/io';
import {useSelector, useDispatch} from 'react-redux';
import Spinner from '../ui-share/Spinner';
import {AuthContextRestaurant} from '../context/AuthContextRestaurant'; // Import AuthContextRestaurant

export default function Navbar() {
	const [sidebarMenu, setSidebarMenu] = useState(false);
	const [loading, setLoading] = useState(false);

	const sidebarRef = useRef(null);

	const navigate = useNavigate();

	const storeRestaurantId = useSelector((state) => state.user.user.res_uuid);

	const {logout, userType, user} = useContext(AuthContextRestaurant);

	// Define the links array conditionally based on userType
	const links =
		userType === 'admin'
			? [
					{to: '/dashboard', icon: <BiBookAlt size={25} />, text: 'Dashboard'},
					{
						to: `/dashboard/reservation/${userType === 'admin' ? user.res_uuid : storeRestaurantId}`,
						icon: <BiBookAlt size={25} />,
						text: 'Reservation',
					},
					{
						to: `/dashboard/capacity/${userType === 'admin' ? user.res_uuid : storeRestaurantId}`,
						icon: <BiBookAlt size={25} />,
						text: 'Capacity',
					},
					{
						to: `/dashboard/availability/${userType === 'admin' ? user.res_uuid : storeRestaurantId}`,
						icon: <BiBookAlt size={25} />,
						text: 'Availability',
					},
					// {
					// 	to: `/dashboard/review-manage/${userType === 'admin' ? user.res_uuid : storeRestaurantId}`,
					// 	icon: <BiBookAlt size={25} />,
					// 	text: 'Review Manage',
					// },
					{
						to: `/dashboard/user-create/${userType === 'admin' ? user.res_uuid : storeRestaurantId}`,
						icon: <BiBookAlt size={25} />,
						text: 'User Create',
					},
			  ]
			: userType === 'staff'
			? [
					{to: '/dashboard', icon: <BiBookAlt size={25} />, text: 'Dashboard'},
					{to: '/dashboard/reservation', icon: <BiBookAlt size={25} />, text: 'Reservation'},
					{to: '/dashboard/capacity', icon: <BiBookAlt size={25} />, text: 'Capacity'},
					{to: '/dashboard/availability', icon: <BiBookAlt size={25} />, text: 'Availability'},
					// {to: '/dashboard/review-manage', icon: <BiBookAlt size={25} />, text: 'Review Manage'},
			  ]
			: userType === 'super_admin'
			? [
					// Add other links for super_admin users here
					{to: '/dashboard', icon: <BiBookAlt size={25} />, text: 'Dashboard'},
					{to: '/dashboard/restaurant-info', icon: <BiBookAlt size={25} />, text: 'Restaurant'},
			  ]
			: [
					// Add default links or an empty array for other user types
					{to: '/profile', icon: <BiBookAlt size={25} />, text: 'Profile'},
			  ];

	const handleSidebarMenu = () => {
		setSidebarMenu(!sidebarMenu);
	};

	const handleSidebarClose = () => {
		setSidebarMenu(false);
	};

	const handleClickOutside = (event) => {
		if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
			setSidebarMenu(false);
		}
	};

	const handleLogout = async () => {
		setLoading(true);
		try {
			await logout(); // Call logout from AuthContextRestaurant
			navigate('/restaurant-sign-in'); // Redirect to login page after logout
		} catch (error) {
			console.error('Error during logout:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (sidebarMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [sidebarMenu]);

	return (
		<div className="flex flex-col">
			<div className="bg-white shadow border-b fixed top-0 left-0 w-full z-[1000] py-2">
				<div className="flex justify-between items-center px-5 py-4">
					<div className="flex items-center gap-2 cursor-pointer" onClick={handleSidebarMenu}>
						<CiMenuFries size={25} className="custom-cursor text-button font-bold" />
						<span className="hidden md:block text-button font-bold">Menu</span>
					</div>
					{/* <div className="flex items-center gap-3">
						<button className="text-button md:text-[16px] text-sm border border-button md:px-5 px-3 py-2 rounded-md font-bold">
							+ Walk In
						</button>
						<button className="text-button md:text-[16px] text-sm border border-button md:px-5 px-3 py-2 rounded-md font-bold">
							+ Reservation
						</button>
					</div> */}
				</div>
			</div>
			<div
				ref={sidebarRef}
				className={`sidebar w-[350px] bg-white shadow-lg h-full fixed top-0 left-0 transition-transform duration-300 z-[1000] ${
					sidebarMenu ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div className="relative w-full h-full px-5 py-5">
					<div
						className="flex items-center gap-1 text-titleText hover:text-button cursor-pointer font-bold"
						onClick={handleSidebarClose}
					>
						<RxCross2 size={25} /> Close
					</div>

					<div className="flex flex-col gap-5 h-full overflow-auto">
						<div className="py-10">
							{userType === 'super_admin' ? (
								<>
									<h1 className="text-2xl font-bold">{user.name}</h1>
									<small>{user.email}</small>
									<br />
								</>
							) : (
								<>
									<h1 className="text-2xl font-bold capitalize">{user?.name}</h1>
									<small className="text-xl font-bold capitalize">{userType}</small>
								</>
							)}
						</div>
						<div className="flex flex-col gap-10 h-full p-4">
							{links.map((link, index) => (
								<Link to={link.to} key={index} onClick={() => setSidebarMenu(false)}>
									<div className="flex items-center justify-between gap-3 group">
										<div className="flex items-center gap-2 group-hover:text-button">
											{link.icon}
											<span className="text-titleText text-xl group-hover:text-button">{link.text}</span>
										</div>
										<FaAngleRight className="group-hover:text-button" />
									</div>
								</Link>
							))}

							{/* Logout link placed at the bottom */}
							<div
								className="flex items-center justify-between gap-3 group bg-buttonHover p-2 text-center absolute bottom-0 left-0 right-0"
								onClick={handleLogout}
							>
								<div className="flex items-center gap-2 text-white w-full justify-center">
									<IoIosLogOut size={25} />
									<span className="text-xl text-white cursor-pointer">Log Out</span>
									{loading ? <Spinner /> : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
