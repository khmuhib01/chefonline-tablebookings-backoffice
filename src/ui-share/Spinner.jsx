import React from 'react';

export default function Spinner() {
	return (
		<div className=" flex justify-center items-center">
			<div className="animate-spin rounded-full h-[16px] w-[16px] border-b-2 border-white"></div>
		</div>
	);
}
