export function formatMoney(value: number | string) {
	// Convert string to number if necessary
	const numericValue = typeof value === 'string' ? parseFloat(value) : value;

	// Handle invalid string inputs gracefully
	if (isNaN(numericValue)) {
		return '$0.00';
	}

	const formattedNumber = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(numericValue);

	return `$${formattedNumber}`;
}
