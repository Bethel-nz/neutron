/**
 * @note This is a simple hash function to generate consistent colors from strings
 */
export function stringToColor(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Convert to hex color
	let color = '#';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xFF;
		color += ('00' + value.toString(16)).substr(-2);
	}

	return color;
}

/**
 * @note Get contrasting text color (black or white) based on background color
 */
export function getContrastText(hexcolor: string) {
	// Remove the # if present
	const hex = hexcolor.replace('#', '');

	// Convert to RGB
	const r = parseInt(hex.substr(0, 2), 16);
	const g = parseInt(hex.substr(2, 2), 16);
	const b = parseInt(hex.substr(4, 2), 16);

	// Calculate luminance
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * @note Generate a gradient from a string
 * @hack Using string length to vary the gradient angle
 */
export function stringToGradient(str: string) {
	const color1 = stringToColor(str);
	// Generate second color by using reversed string
	const color2 = stringToColor(str.split('').reverse().join(''));
	const angle = (str.length * 137.508) % 360; // Golden angle to get good distribution

	return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
} 