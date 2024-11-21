import React from 'react';

export default function PendingReviewsComponent({reviews, onApprove, onDeny}) {
	// Helper function to render stars based on the rating
	const renderStars = (rating) => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			if (i < rating) {
				stars.push(
					<span key={i} className="text-yellow-400">
						★
					</span>
				);
			} else {
				stars.push(
					<span key={i} className="text-gray-300">
						★
					</span>
				);
			}
		}
		return stars;
	};

	return (
		<div>
			{reviews.length > 0 ? (
				reviews.map((review) => (
					<div
						key={review.id}
						className="border p-6 rounded-lg shadow-lg mb-6 bg-white transition duration-300 ease-in-out hover:shadow-xl"
					>
						<div className="flex justify-between items-center">
							{/* Display the review rating with stars */}
							<div className="flex items-center">
								{renderStars(review.rating)}
								<p className="ml-2 text-gray-600 font-bold">{review.rating} / 5</p>
							</div>
							{/* Display action buttons */}
							<div className="flex gap-3">
								<button
									className="bg-green-500 hover:bg-green-600 text-white font-semibold p-2 rounded transition duration-300"
									onClick={() => onApprove(review.id)}
								>
									Approve
								</button>
								<button
									className="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded transition duration-300"
									onClick={() => onDeny(review.id)}
								>
									Deny
								</button>
							</div>
						</div>

						{/* Display the review content */}
						<p className="mt-4 text-gray-700">{review.content}</p>
					</div>
				))
			) : (
				<p className="text-center text-gray-500">No pending reviews.</p>
			)}
		</div>
	);
}
