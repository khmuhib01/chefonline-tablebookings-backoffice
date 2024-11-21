import React, {useState, useContext} from 'react';
import Tabs from '../../../ui-share/Tabs';
import {useNavigate, useParams} from 'react-router-dom';
import {AuthContextRestaurant} from '../../../context/AuthContextRestaurant';
import PageTitle from '../../../components/PageTitle';
import PendingReviewsComponent from './components/PendingReviewsComponent';
import ApprovedReviewsComponent from './components/ApprovedReviewsComponent';

export default function ReviewManage() {
	const {id} = useParams();
	const navigate = useNavigate();
	const {isAuthenticated, userType} = useContext(AuthContextRestaurant);

	// Simulating review data
	const [reviews, setReviews] = useState([
		{id: 1, content: 'Great service!', status: 'pending'},
		{id: 2, content: 'Food was cold', status: 'approved'},
		{id: 3, content: 'Loved the ambiance', status: 'pending'},
	]);

	const handleApprove = (reviewId) => {
		setReviews(reviews.map((review) => (review.id === reviewId ? {...review, status: 'approved'} : review)));
	};

	const handleDeny = (reviewId) => {
		setReviews(reviews.filter((review) => review.id !== reviewId));
	};

	const tabs = [
		{
			label: 'Pending Reviews',
			content: (
				<PendingReviewsComponent
					reviews={reviews.filter((r) => r.status === 'pending')}
					onApprove={handleApprove}
					onDeny={handleDeny}
				/>
			),
		},
		{
			label: 'Approved Reviews',
			content: <ApprovedReviewsComponent reviews={reviews.filter((r) => r.status === 'approved')} />,
		},
	];

	return (
		<>
			<PageTitle title="Review Management" description="Manage reviews by approving or denying them." />
			<div className="min-h-screen">
				<div className="container">
					<div className="max-w-[700px] mx-auto px-5">
						<div className="flex flex-col gap-5">
							<div className="flex items-center justify-between">
								<h1 className="text-2xl font-bold">Manage Reviews</h1>
								{isAuthenticated && userType === 'super_admin' && (
									<button
										className="bg-button text-white p-2 rounded-lg hover:bg-buttonHover focus:outline-none focus:ring-2"
										onClick={() => navigate('/dashboard/restaurant-info')}
									>
										Restaurant List
									</button>
								)}
							</div>
							<div>
								<Tabs tabs={tabs} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
