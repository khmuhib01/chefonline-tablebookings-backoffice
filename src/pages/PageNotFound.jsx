import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import PageTitle from '../components/PageTitle';

export default function PageNotFound() {
	const navigate = useNavigate();

	const handleHomeClick = () => {
		navigate('/');
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);
	return (
		<>
			<PageTitle title="Page Not Found" description="Search Result Page Description" />
			<div className="flex items-center justify-center h-[60vh] bg-[#F7F8FA]">
				<div className="bg-white p-10 rounded shadow-lg text-center border">
					<h1 className="text-4xl font-bold mb-4">404</h1>
					<p className="text-xl mb-8">Page Not Found</p>
					<button onClick={handleHomeClick} className="bg-button text-white py-2 px-4 rounded hover:bg-buttonHover">
						Home
					</button>
				</div>
			</div>
		</>
	);
}
