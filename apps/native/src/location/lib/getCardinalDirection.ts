export function getCardinalDirection(heading: number): string {
	const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
	const index = Math.round(((heading %= 360) < 0 ? heading + 360 : heading) / 45) % 8;
	return directions[index];
}
