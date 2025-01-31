import React from 'react';
import {Calendar2, People, Time, Status} from '../../../ui-share/Icon';
import {formatDate, formatTime} from '../../../utils/conversions';
import Spinner from '../../../ui-share/Spinner';

export default function ReservationCard({
	data,
	handleCheckedIn,
	handleCancel,
	handleCheckedOut,
	handleView,
	isLoading,
	loadingReservationId,
}) {
	return (
		<div>
			{data.length === 0 ? (
				<div className="text-titleText font-bold">No Data Found</div>
			) : (
				data.map((item, index) => (
					<div className="bg-white shadow-md rounded-md p-4 flex items-center justify-between mb-4" key={index}>
						<div className="flex items-center space-x-4">
							<div
								className={`border ${
									item?.status === 'pending'
										? 'bg-green-200 border-green-600'
										: item?.status === 'checkin'
										? 'bg-amber-100 border-amber-400'
										: item?.status === 'completed'
										? 'bg-blue-100 border-blue-400'
										: 'bg-red-200 border-button'
								} p-2 rounded-md text-center`}
							>
								<p
									className={`text-xs ${
										item?.status === 'pending'
											? 'text-green-600'
											: item?.status === 'checkin'
											? 'text-amber-600'
											: item?.status === 'completed'
											? 'text-blue-500'
											: 'text-red-500'
									} uppercase font-bold`}
								>
									TABLE
								</p>
								<p
									className={`text-lg font-bold ${
										item?.status === 'pending'
											? 'text-green-600'
											: item?.status === 'checkin'
											? 'text-amber-600'
											: item?.status === 'completed'
											? 'text-blue-500'
											: 'text-red-500'
									}`}
								>
									{item?.table_master?.table_name}
								</p>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-gray-700 flex items-center gap-2">
									<People size={16} className="text-bodyText" />
									<span className="text-titleText font-bold text-sm">{item?.number_of_people}</span>
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
									<span className="text-titleText font-bold text-sm capitalize">
										{item?.status === 'pending'
											? 'Pending'
											: item?.status === 'check_in'
											? 'Checked in'
											: item?.status === 'completed'
											? 'Completed'
											: item?.status === 'cancelled' && 'Cancelled'}
									</span>
								</p>
							</div>
						</div>
						<div className="block sm:flex items-center justify-end gap-3 sm:space-y-0 space-y-2 flex-1">
							{item?.status === 'pending' &&
							item.reservation_date === formatDate(new Date().toISOString().split('T')[0]) ? (
								<>
									<span className="text-titleText font-bold text-sm"></span>

									<button
										className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-2 px-4 rounded-md flex items-center gap-2"
										onClick={() => handleView(item?.uuid)}
									>
										View
										{isLoading && <Spinner />}
									</button>
									<button
										className="border border-button text-button hover:bg-buttonHover hover:text-white py-2 px-4 rounded-md flex items-center justify-end gap-2"
										onClick={() => handleCancel(item?.uuid)}
									>
										Cancel
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
									<button
										className={`px-4 py-2 border ${
											item?.status === 'pending'
												? 'bg-green-200 text-green-600 hover:text-white rounded-md hover:bg-green-600 border-green-600'
												: item?.status === 'checkin'
												? 'bg-amber-100 text-amber-600 hover:text-white rounded-md hover:bg-amber-600 border-amber-400'
												: 'bg-button text-white rounded-md hover:bg-buttonHover'
										} focus:outline-none flex items-center justify-end gap-2`}
										onClick={() => handleCheckedIn(item?.uuid)}
									>
										Check in
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
								</>
							) : item?.status === 'check_in' &&
							  item.reservation_date === formatDate(new Date().toISOString().split('T')[0]) ? (
								<>
									<button
										className="border border-button text-button hover:bg-buttonHover hover:text-white py-2 px-4 rounded-md flex items-center justify-end gap-2"
										onClick={() => handleCancel(item?.uuid)}
									>
										Cancel
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
									<button
										className={`px-4 py-2 border ${
											item?.status === 'checkin'
												? 'bg-amber-100 text-amber-600 hover:text-white rounded-md hover:bg-amber-600 border-amber-600'
												: 'bg-button text-white rounded-md hover:bg-buttonHover'
										} focus:outline-none flex items-center justify-end gap-2`}
										onClick={() => handleCheckedOut(item?.uuid)}
									>
										Check out
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
								</>
							) : item?.status === 'completed' ? (
								<>
									<button
										className={`border ${
											item?.status === 'completed'
												? 'text-blue-600 hover:text-white rounded-md hover:bg-blue-600 border-blue-600'
												: 'bg-button text-white rounded-md hover:bg-buttonHover'
										} focus:outline-none flex items-center justify-end gap-2} py-2 px-4 rounded-md flex items-center justify-end gap-2`}
										onClick={() => handleView(item?.uuid)}
									>
										View
										{loadingReservationId === item?.uuid ? <Spinner /> : null}
									</button>
								</>
							) : (
								<button
									className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-2 px-4 rounded-md flex items-center gap-2"
									onClick={() => handleView(item?.uuid)}
								>
									View
									{isLoading && <Spinner />}
								</button>
							)}
						</div>
					</div>
				))
			)}
		</div>
	);
}
