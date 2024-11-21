export const formatDateAndDay = (selectedDate) => {
	if (!selectedDate) {
		return {formattedDate: '', dayOfWeek: ''};
	}

	const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${selectedDate.getFullYear()}`; // Format date as DD/MM/YYYY
	const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	const dayOfWeek = daysOfWeek[selectedDate.getDay()]; // Get day of the week as Thu (for example)

	return {formattedDate, dayOfWeek};
};

// Function to format time
// export const formatTime = (time) => {
// 	const [hours, minutes] = time.split(':');
// 	const date = new Date();
// 	date.setHours(hours);
// 	date.setMinutes(minutes);
// 	const options = {hour: 'numeric', minute: 'numeric', hour12: true};
// 	return date.toLocaleString('en-US', options);
// };

export const formatTime = (timeStr) => {
	if (!timeStr) return '12:00 AM';

	// Split the time string into components
	const [hours, minutes] = timeStr.split(':').map(Number);

	// Ensure the time components are valid numbers
	if (isNaN(hours) || isNaN(minutes)) return '12:00 AM';

	// Determine AM or PM
	const period = hours >= 12 ? 'PM' : 'AM';

	// Convert hours from 24-hour to 12-hour format
	let formattedHours = hours % 12 || 12; // Convert hour '0' to '12'
	formattedHours = formattedHours.toString().padStart(2, '0'); // Add leading zero if necessary

	const formattedMinutes = minutes.toString().padStart(2, '0');

	return `${formattedHours}:${formattedMinutes} ${period}`;
};



export const formatDate = (date) => {
	const d = new Date(date);
	let day = d.getDate();
	let month = d.getMonth() + 1;
	const year = d.getFullYear();

	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}
	return `${day}/${month}/${year}`;
};
