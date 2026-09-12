export const formatDate = (dateInput: string | Date | undefined) => {
	if (!dateInput) return '';

	if (typeof dateInput === 'string') {
		const dateOnly = dateInput.split('T')[0];
		const parts = dateOnly.split('-');
		if (parts.length === 3) {
			const [year, month, day] = parts.map(Number);
			return new Date(year, month - 1, day).toLocaleDateString();
		}
	}

	return new Date(dateInput).toLocaleDateString();
};
