export function isValidEmail(email: string) {
	const trimmedEmail = email.trim();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(trimmedEmail);
}
