export function calculateDistance(points: [number, number][]): number {
	const radians = Math.PI / 180;
	let distance = 0;
	for (let i = 1; i < points.length; i++) {
		const [lon1, lat1] = points[i - 1];
		const [lon2, lat2] = points[i];
		const dLat = (lat2 - lat1) * radians;
		const dLon = (lon2 - lon1) * radians;
		const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * radians) * Math.cos(lat2 * radians) * Math.sin(dLon / 2) ** 2;
		distance += 2 * 6371000 * Math.asin(Math.sqrt(Math.min(1, a)));
	}
	return distance;
}

export function formatDistance(meters: number): string {
	return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(2)} km`;
}
