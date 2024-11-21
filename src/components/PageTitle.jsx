// src/components/PageTitle.jsx

import React from 'react';
import {Helmet} from 'react-helmet-async';

const PageTitle = ({title, description}) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="title" content={title} />
			<meta name="description" content={description} />
		</Helmet>
	);
};

export default PageTitle;
