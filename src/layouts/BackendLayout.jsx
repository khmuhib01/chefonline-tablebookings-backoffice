import {Outlet} from 'react-router-dom';
import Navbar from './Navbar';

export default function BackendLayout({children}) {
	return (
		<div className="flex flex-col min-h-screen bg-[#F7F8FA]">
			<Navbar />

			<div className="mt-[71px] py-10">
				{children}
				<Outlet />
			</div>
		</div>
	);
}
