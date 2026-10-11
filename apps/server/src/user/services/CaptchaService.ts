import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {config} from '../../config';

const FONT_5X7: Record<string, number[]> = {
	'0': [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e],
	'1': [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
	'2': [0x0e, 0x11, 0x01, 0x06, 0x08, 0x10, 0x1f],
	'3': [0x1f, 0x02, 0x04, 0x02, 0x01, 0x11, 0x0e],
	'4': [0x02, 0x06, 0x0a, 0x12, 0x1f, 0x02, 0x02],
	'5': [0x1f, 0x10, 0x1e, 0x01, 0x01, 0x11, 0x0e],
	'6': [0x06, 0x08, 0x10, 0x1e, 0x11, 0x11, 0x0e],
	'7': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
	'8': [0x0e, 0x11, 0x11, 0x0e, 0x11, 0x11, 0x0e],
	'9': [0x0e, 0x11, 0x11, 0x0f, 0x01, 0x02, 0x0c],
	A: [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
	B: [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
	C: [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
	D: [0x1c, 0x12, 0x11, 0x11, 0x11, 0x12, 0x1c],
	E: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
	F: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
	G: [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f],
	H: [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
	I: [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
	J: [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0c],
	K: [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
	L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
	M: [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
	N: [0x11, 0x11, 0x19, 0x15, 0x13, 0x11, 0x11],
	O: [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
	P: [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
	Q: [0x0e, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0d],
	R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
	S: [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
	T: [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
	U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
	V: [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
	W: [0x11, 0x11, 0x11, 0x15, 0x15, 0x1b, 0x11],
	X: [0x11, 0x11, 0x0a, 0x04, 0x0a, 0x11, 0x11],
	Y: [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04],
	Z: [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
};

const CHARACTERS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const PALETTE = [
	'#1e40af', // Blue
	'#047857', // Emerald
	'#b91c1c', // Red
	'#6d28d9', // Purple
	'#c2410c', // Orange
	'#0e7490', // Cyan
	'#334155', // Slate
	'#854d0e', // Amber
];

export interface CaptchaResult {
	captchaId: string;
	image: string;
	svg: string;
}

export class CaptchaService {
	generateRandomCode(length = 5): string {
		let result = '';
		for (let i = 0; i < length; i++) {
			const index = Math.floor(Math.random() * CHARACTERS.length);
			result += CHARACTERS[index];
		}
		return result;
	}

	generateCaptcha(length = 5): CaptchaResult {
		const code = this.generateRandomCode(length);
		const width = 180;
		const height = 50;

		const svg = this.createSvg(code, width, height);
		const bmpBuffer = this.createBmp(code, width, height);
		const image = `data:image/bmp;base64,${bmpBuffer.toString('base64')}`;

		const hash = crypto.createHash('sha256').update(code.toUpperCase()).digest('hex');
		const captchaId = jwt.sign({hash, nonce: crypto.randomUUID(), purpose: 'captcha'}, config.ACCESS_SECRET, {
			expiresIn: '10m',
		});

		return {
			captchaId,
			image,
			svg,
		};
	}

	verifyCaptcha(captchaId: string, answer: string): void {
		if (!captchaId || !answer || typeof answer !== 'string') {
			throw new Error('Please enter the captcha verification code.');
		}

		let payload: {hash: string; nonce: string; purpose: string};
		try {
			payload = jwt.verify(captchaId, config.ACCESS_SECRET) as {hash: string; nonce: string; purpose: string};
		} catch {
			throw new Error('Verification code has expired. Please refresh the captcha and try again.');
		}

		if (payload.purpose !== 'captcha') {
			throw new Error('Invalid verification code.');
		}

		const providedHash = crypto.createHash('sha256').update(answer.trim().toUpperCase()).digest('hex');
		if (payload.hash !== providedHash) {
			throw new Error('Incorrect captcha code. Please try again.');
		}
	}

	private createSvg(code: string, width: number, height: number): string {
		const charSpacing = width / (code.length + 1);
		let noiseLines = '';
		for (let i = 0; i < 4; i++) {
			const x1 = Math.floor(Math.random() * width);
			const y1 = Math.floor(Math.random() * height);
			const x2 = Math.floor(Math.random() * width);
			const y2 = Math.floor(Math.random() * height);
			const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
			noiseLines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.2" opacity="0.35"/>`;
		}

		let noiseDots = '';
		for (let i = 0; i < 30; i++) {
			const cx = Math.floor(Math.random() * width);
			const cy = Math.floor(Math.random() * height);
			const r = Math.random() * 1.8 + 0.8;
			const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
			noiseDots += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="${color}" opacity="0.4"/>`;
		}

		let charElements = '';
		for (let i = 0; i < code.length; i++) {
			const char = code[i];
			const x = Math.floor((i + 0.8) * charSpacing);
			const y = Math.floor(height / 2 + 9 + (Math.random() * 8 - 4));
			const rot = Math.floor(Math.random() * 30 - 15);
			const color = PALETTE[i % PALETTE.length];
			const fontSize = Math.floor(26 + Math.random() * 6);
			charElements += `<text x="${x}" y="${y}" font-family="monospace, Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${color}" transform="rotate(${rot}, ${x}, ${y})">${char}</text>`;
		}

		const waveY1 = Math.floor(height * 0.3 + Math.random() * (height * 0.4));
		const waveY2 = Math.floor(height * 0.3 + Math.random() * (height * 0.4));
		const wavePath = `<path d="M 0 ${waveY1} Q ${width / 2} ${waveY2} ${width} ${height - waveY1}" stroke="#0088cc" stroke-width="2" fill="none" opacity="0.45"/>`;

		return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background-color: #f8fafc; border-radius: 6px; border: 1px solid #cbd5e1;">
      <rect width="${width}" height="${height}" rx="6" fill="#f8fafc"/>
      ${noiseDots}
      ${noiseLines}
      ${wavePath}
      ${charElements}
    </svg>`;
	}

	private createBmp(code: string, width: number, height: number): Buffer {
		const rowBytes = Math.ceil((width * 3) / 4) * 4;
		const imageSize = rowBytes * height;
		const fileSize = 54 + imageSize;

		const buffer = Buffer.alloc(fileSize);

		// BMP Header (14 bytes)
		buffer.write('BM', 0);
		buffer.writeUInt32LE(fileSize, 2);
		buffer.writeUInt32LE(0, 6);
		buffer.writeUInt32LE(54, 10);

		// DIB Header / BITMAPINFOHEADER (40 bytes)
		buffer.writeUInt32LE(40, 14);
		buffer.writeInt32LE(width, 18);
		buffer.writeInt32LE(-height, 22); // Top-down DIB
		buffer.writeUInt16LE(1, 26);
		buffer.writeUInt16LE(24, 28); // 24-bit RGB
		buffer.writeUInt32LE(0, 30);
		buffer.writeUInt32LE(imageSize, 34);
		buffer.writeUInt32LE(2835, 38);
		buffer.writeUInt32LE(2835, 42);
		buffer.writeUInt32LE(0, 46);
		buffer.writeUInt32LE(0, 50);

		// Fill background with light slate (#f1f5f9 -> RGB 241, 245, 249 -> BGR 249, 245, 241)
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const offset = 54 + y * rowBytes + x * 3;
				buffer[offset] = 249; // B
				buffer[offset + 1] = 245; // G
				buffer[offset + 2] = 241; // R
			}
		}

		const setPixel = (x: number, y: number, r: number, g: number, b: number) => {
			if (x < 0 || x >= width || y < 0 || y >= height) return;
			const offset = 54 + y * rowBytes + x * 3;
			buffer[offset] = b;
			buffer[offset + 1] = g;
			buffer[offset + 2] = r;
		};

		// Background noise lines
		for (let i = 0; i < 4; i++) {
			const x0 = Math.floor(Math.random() * width);
			const y0 = Math.floor(Math.random() * height);
			const x1 = Math.floor(Math.random() * width);
			const y1 = Math.floor(Math.random() * height);
			this.drawBmpLine(setPixel, x0, y0, x1, y1, 160, 180, 200);
		}

		// Background noise dots
		for (let i = 0; i < 60; i++) {
			const px = Math.floor(Math.random() * width);
			const py = Math.floor(Math.random() * height);
			setPixel(px, py, 180, 190, 205);
			setPixel(px + 1, py, 180, 190, 205);
		}

		// Draw characters
		const charWidth = 5;
		const charHeight = 7;
		const scale = 3;
		const spacing = Math.floor(width / (code.length + 1));

		const colors = [
			{r: 30, g: 64, b: 175},
			{r: 4, g: 120, b: 87},
			{r: 185, g: 28, b: 28},
			{r: 109, g: 40, b: 217},
			{r: 194, g: 65, b: 12},
			{r: 14, g: 116, b: 144},
		];

		for (let i = 0; i < code.length; i++) {
			const char = code[i];
			const bitmap = FONT_5X7[char];
			const startX = Math.floor((i + 0.6) * spacing);
			const startY = Math.floor((height - charHeight * scale) / 2 + (Math.random() * 6 - 3));
			const color = colors[i % colors.length];

			for (let row = 0; row < charHeight; row++) {
				const rowVal = bitmap[row];
				for (let col = 0; col < charWidth; col++) {
					const isSet = (rowVal >> (charWidth - 1 - col)) & 1;
					if (isSet) {
						for (let dx = 0; dx < scale; dx++) {
							for (let dy = 0; dy < scale; dy++) {
								setPixel(startX + col * scale + dx, startY + row * scale + dy, color.r, color.g, color.b);
							}
						}
					}
				}
			}
		}

		// Foreground disturbance line
		const waveY = Math.floor(height / 2);
		for (let x = 0; x < width; x++) {
			const y = Math.floor(waveY + Math.sin(x / 15) * 8);
			setPixel(x, y, 0, 136, 204);
			setPixel(x, y + 1, 0, 136, 204);
		}

		return buffer;
	}

	private drawBmpLine(
		setPixel: (x: number, y: number, r: number, g: number, b: number) => void,
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		r: number,
		g: number,
		b: number,
	) {
		const dx = Math.abs(x1 - x0);
		const dy = Math.abs(y1 - y0);
		const sx = x0 < x1 ? 1 : -1;
		const sy = y0 < y1 ? 1 : -1;
		let err = dx - dy;

		let currX = x0;
		let currY = y0;

		for (;;) {
			setPixel(currX, currY, r, g, b);
			if (currX === x1 && currY === y1) break;
			const e2 = 2 * err;
			if (e2 > -dy) {
				err -= dy;
				currX += sx;
			}
			if (e2 < dx) {
				err += dx;
				currY += sy;
			}
		}
	}
}
