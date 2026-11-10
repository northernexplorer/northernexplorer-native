export const MIN_SCALE = 1;
export const MAX_SCALE = 5;

const WHEEL_LINE_HEIGHT = 16;
const WHEEL_ZOOM_SENSITIVITY = 0.001;

export function normalizeWheelDelta(deltaY: number, deltaMode: number, pageHeight: number): number {
	if (deltaMode === 1) return deltaY * WHEEL_LINE_HEIGHT;
	if (deltaMode === 2) return deltaY * Math.max(pageHeight, 1);
	return deltaY;
}

export function getWheelZoomScale(currentScale: number, deltaY: number, deltaMode: number, pageHeight: number): number {
	const normalizedDelta = normalizeWheelDelta(deltaY, deltaMode, pageHeight);
	const nextScale = currentScale * Math.exp(-normalizedDelta * WHEEL_ZOOM_SENSITIVITY);
	return Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
}
