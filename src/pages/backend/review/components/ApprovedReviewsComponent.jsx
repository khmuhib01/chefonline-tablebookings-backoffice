import React from 'react';

export default function ApprovedReviewsComponent({reviews}) {
	return (
		<div>
			{reviews.length > 0 ? (
				reviews.map((review) => (
					<div key={review.id} className="border p-4 rounded-lg mb-4">
						<p>{review.content}</p>
					</div>
				))
			) : (
				<p>No approved reviews.</p>
			)}
		</div>
	);
}
