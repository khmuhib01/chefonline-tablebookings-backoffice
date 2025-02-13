import React from 'react';
import {Calendar2, People, Time, Status} from '../../../ui-share/Icon';
import {formatDate, formatTime} from '../../../utils/conversions';
import Spinner from '../../../ui-share/Spinner';

export default function ReservationCard({
	data,
	handleCheckedIn,
	handleCancel,
	handleCheckedOut,
	handleAccept,
	handleReject,
	handleView,
	isLoading,
	loadingReservationId,
}) {
	// console.log('data', data);
	return (
		<div className="w-full">
			{data.length === 0 ? (
				<div className="text-titleText font-bold text-center">No Data Found</div>
			) : (
				data.map((item, index) => (
					<div
						className="bg-white shadow-md rounded-md p-4 flex flex-col lg:flex-row items-center lg:justify-between mb-4 w-full"
						key={index}
					>
						<div className="w-full lg:w-[30%] flex flex-col sm:flex-row items-center gap-4">
							{/* Table Status Badge */}
							<div
								className={`border p-3 rounded-md text-center w-24 ${
									item?.status === 'pending'
										? 'bg-blue-200 border-blue-600'
										: item?.status === 'check_in'
										? 'bg-amber-100 border-amber-400'
										: item?.status === 'completed'
										? 'bg-green-100 border-green-400'
										: 'bg-red-200 border-button'
								}`}
							>
								<p
									className={`text-xs font-bold uppercase ${
										item?.status === 'pending'
											? 'text-blue-600'
											: item?.status === 'check_in'
											? 'text-amber-600'
											: item?.status === 'completed'
											? 'text-green-500'
											: 'text-red-500'
									}`}
								>
									TABLE
								</p>
								<p
									className={`text-lg font-bold ${
										item?.status === 'pending'
											? 'text-blue-600'
											: item?.status === 'check_in'
											? 'text-amber-600'
											: item?.status === 'completed'
											? 'text-green-500'
											: 'text-red-500'
									}`}
								>
									{item?.table_master?.table_name}
								</p>
							</div>

							{/* Reservation Details */}
							<div className="flex flex-col gap-2">
								<p className="text-gray-700 flex items-center gap-2">
									<People size={16} className="text-bodyText" />
									<span className="text-titleText font-bold text-sm">{item?.number_of_people} Guests</span>
								</p>
								<p className="text-gray-500 text-sm flex items-center gap-2">
									<Time size={16} className="text-bodyText" />
									<span className="text-titleText font-bold text-sm">{formatTime(item?.reservation_time)}</span>
								</p>
								<p className="text-gray-500 text-sm flex items-center gap-2">
									<Calendar2 size={16} className="text-bodyText" />
									<span className="text-titleText font-bold text-sm">{item?.reservation_date}</span>
								</p>
								<p className="text-gray-500 text-sm flex items-center gap-2">
									<Status size={16} className="text-bodyText" />
									<span
										className={`${
											item.status === 'pending'
												? 'text-blue-600'
												: item.status === 'check_in'
												? 'text-amber-600'
												: item.status === 'completed'
												? 'text-green-500'
												: item.status === 'cancelled'
												? 'text-red-500'
												: item.status === 'confirmed' && 'text-green-600'
										} font-bold text-sm capitalize`}
									>
										{item?.status === 'pending'
											? 'Pending'
											: item?.status === 'check_in'
											? 'Checked In'
											: item?.status === 'completed'
											? 'Completed'
											: item?.status === 'cancelled'
											? 'Cancelled'
											: item?.status === 'confirmed' && 'Confirmed'}
									</span>
								</p>
							</div>
						</div>

						<div className="w-full lg:w-[70%] flex flex-wrap justify-center lg:justify-end gap-2 mt-4 lg:mt-0">
							<button
								className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-2 px-4 rounded-md flex items-center gap-2"
								onClick={() => handleView(item?.uuid)}
							>
								View
								{isLoading && <Spinner />}
							</button>

							{/* Actions based on Reservation Status */}
							{item?.status === 'confirmed' &&
							item.reservation_date === formatDate(new Date().toISOString().split('T')[0]) ? (
								<>
									<button
										className="border border-button text-button hover:bg-buttonHover hover:text-white py-2 px-4 rounded-md flex items-center justify-center"
										onClick={() => handleCancel(item?.uuid)}
									>
										Cancel
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
									<button
										className="border bg-blue-200 text-blue-600 hover:bg-blue-600 border-blue-600 hover:text-white py-2 px-4 rounded-md flex items-center justify-center"
										onClick={() => handleCheckedIn(item?.uuid)}
									>
										Check In
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
								</>
							) : item?.status === 'check_in' &&
							  item.reservation_date === formatDate(new Date().toISOString().split('T')[0]) ? (
								<>
									<button
										className="border bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white py-2 px-4 rounded-md flex items-center justify-center"
										onClick={() => handleCheckedOut(item?.uuid)}
									>
										Check Out
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
								</>
							) : item?.status === 'pending' &&
							  item.reservation_date === formatDate(new Date().toISOString().split('T')[0]) ? (
								<>
									<button
										className="border border-green-600 bg-green-100 text-green-600 hover:bg-green-600 hover:text-white py-2 px-4 rounded-md flex items-center justify-center"
										onClick={() => handleAccept(item?.uuid)}
									>
										Accept
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
									<button
										className="border border-red-600 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white py-2 px-4 rounded-md flex items-center justify-center"
										onClick={() => handleReject(item?.uuid)}
									>
										Reject
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
								</>
							) : null}
						</div>
					</div>
				))
			)}
		</div>
	);
}
