export function formatName({firstName, lastName}: {firstName: string; lastName: string}) {
	const fullName = `${firstName} ${lastName}`.trim();
	return fullName.replace(/-/g, ' ');
}
