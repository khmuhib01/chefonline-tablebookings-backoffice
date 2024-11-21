import React, {useState} from 'react';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';

export default function TestPage() {
	const [location, setLocation] = useState('London');
	const [dropdownVisible, setDropdownVisible] = useState(false);

	const handleLocationChange = (newLocation) => {
		setLocation(newLocation);
		setDropdownVisible(false);
	};

	return (
		<>
			<ReviewScoreSlider min={1} max={6} />
			<RestaurantPriceSlider min={1} max={5} step={1} />
			<BookableOnlineToggle />
			<Reservation />

			<div className="table mx-auto">
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateCalendar />
				</LocalizationProvider>
			</div>

			<div className="max-w-md mx-auto">
				<AccordionItem title="Section 1">Content for section 1.</AccordionItem>
				<AccordionItem title="Section 2">Content for section 2.</AccordionItem>
				<AccordionItem title="Section 3" initiallyOpen={true}>
					Content for section 3.
				</AccordionItem>
			</div>
			<div className="flex justify-center items-center bg-gray-100">
				<div className="flex space-x-2">
					{/* Find restaurants or cuisines input */}
					<input
						type="text"
						placeholder="Find restaurants or cuisines"
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
					/>

					{/* Location input with dropdown */}
					<div className="relative">
						<input
							type="text"
							value={location}
							onFocus={() => setDropdownVisible(true)}
							readOnly
							className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
						/>
						<div className="absolute right-2 top-2.5">
							<svg
								className="w-5 h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
							</svg>
						</div>
						{dropdownVisible && (
							<div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
								<div className="p-2">
									<button
										onClick={() => handleLocationChange('Near me')}
										className="flex items-center space-x-2 p-2 hover:bg-gray-100 w-full text-left"
									>
										<svg
											className="w-5 h-5 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M3 10h1m10-4h1m-5 5H6m-3 9h1m10-4h1m-5 5H6m-3-9h1M21 10h-1m-10 4h-1m5-5h-1m5 5h-1m-10-4H6m-3 9h1m10-4h1m-5 5H6m-3-9h1M21 10h-1m-10 4h-1m5-5h-1m5 5h-1"
											></path>
										</svg>
										<span>Near me</span>
									</button>
									<button
										onClick={() => handleLocationChange('Dhaka')}
										className="p-2 hover:bg-gray-100 w-full text-left"
									>
										Dhaka
									</button>
									<button
										onClick={() => handleLocationChange('Bangkok')}
										className="p-2 hover:bg-gray-100 w-full text-left"
									>
										Bangkok
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Find button */}
					<button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">
						Find
					</button>
				</div>
			</div>
		</>
	);
}

const ReviewScoreSlider = ({min, max}) => {
	const [value, setValue] = useState(min);

	return (
		<div className="p-4 bg-white rounded-md shadow-md">
			<h2 className="text-lg font-medium mb-2">Review score</h2>
			<input
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="w-full accent-yellow-500"
			/>
			<div className="flex justify-between text-yellow-500 mt-2">
				{Array.from({length: max - min + 1}, (_, i) => i + min).map((num) => (
					<span key={num}>{num}</span>
				))}
			</div>
		</div>
	);
};

const RestaurantPriceSlider = ({min, max, step}) => {
	const [value, setValue] = useState(min);

	return (
		<div className="p-4 bg-white rounded-md shadow-md mt-4">
			<h2 className="text-lg font-medium mb-2">Restaurant Price</h2>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="w-full accent-yellow-500"
			/>
			<div className="flex justify-between text-yellow-500 mt-2">
				{Array.from({length: (max - min) / step + 1}, (_, i) => (
					<span key={i}>{'£'.repeat(i + 1)}</span>
				))}
			</div>
		</div>
	);
};

const BookableOnlineToggle = () => {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<div className="p-4 bg-white rounded-md shadow-md mt-4">
			<h2 className="text-lg font-medium mb-2">Bookable online</h2>
			<label className="flex items-center cursor-pointer">
				<div className="relative">
					<input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="sr-only" />
					<div className={`block w-10 h-6 rounded-full ${isChecked ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
					<div
						className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
							isChecked ? 'transform translate-x-full' : ''
						}`}
					></div>
				</div>
			</label>
		</div>
	);
};

const Reservation = () => {
	const [people, setPeople] = useState(2);
	const [date, setDate] = useState('2024-07-12');
	const [time, setTime] = useState('6:45 pm');

	return (
		<div className="p-4 max-w-md mx-auto">
			<div className="mb-4">
				<label className="block text-lg font-bold mb-2">Number of People</label>
				<select
					value={people}
					onChange={(e) => setPeople(e.target.value)}
					className="w-full border border-gray-300 rounded p-2"
				>
					{[...Array(10).keys()].map((num) => (
						<option key={num + 1} value={num + 1}>
							{num + 1}
						</option>
					))}
				</select>
			</div>

			<div className="mb-4">
				<label className="block text-lg font-bold mb-2">Select Date</label>
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="w-full border border-gray-300 rounded p-2"
				/>
			</div>

			<div className="mb-4">
				<label className="block text-lg font-bold mb-2">Choose a Time</label>
				<div className="grid grid-cols-3 gap-2">
					{[
						'6:00 pm',
						'6:15 pm',
						'6:30 pm',
						'6:45 pm',
						'7:00 pm',
						'7:15 pm',
						'7:30 pm',
						'7:45 pm',
						'8:00 pm',
						'8:15 pm',
						'8:30 pm',
						'8:45 pm',
					].map((t) => (
						<button
							key={t}
							onClick={() => setTime(t)}
							className={`p-2 border rounded ${
								time === t ? 'bg-red-500 text-white' : 'bg-white text-black border-gray-300'
							}`}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			<div className="mt-4">
				<button className="w-full bg-pink-500 text-white p-2 rounded">Reserve a table at {time}</button>
			</div>
		</div>
	);
};

const AccordionItem = ({title, children, initiallyOpen}) => {
	// const [isOpen, setIsOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(initiallyOpen);

	return (
		<div className="border-b border-gray-300">
			<button className="w-full text-left p-4 bg-gray-100 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
				<div className="flex justify-between items-center">
					<span>{title}</span>
					<span>{isOpen ? '-' : '+'}</span>
				</div>
			</button>
			{isOpen && <div className="p-4 bg-white">{children}</div>}
		</div>
	);
};
