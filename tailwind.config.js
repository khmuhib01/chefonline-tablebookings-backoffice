/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#ffffff',
				secondary: '#F8B333',
				titleText: '#3A4354',
				bodyText: '#808691',
				button: '#C1272D',
				buttonHover: '#EF4444',
				buttonText: '#ffffff',
			},
			backgroundImage: {
				'radial-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
			},
		},
		container: {
			center: true,
		},
	},
	plugins: [],
};
