import React from 'react';

const Skeleton = ({width, height, className}) => (
	<div className={`animate-pulse bg-gray-200 ${className}`} style={{width, height}} />
);

export default Skeleton;
