import {EnrichedMarkdownText, LinkPressEvent, MarkdownStyle} from 'react-native-enriched-markdown';
import React, {useMemo} from 'react';
import {Linking} from 'react-native';

function normalizeUnderlineTags(text: string): string {
	if (!text || (!text.includes('<u') && !text.includes('<U') && !text.includes('<ins') && !text.includes('<INS'))) {
		return text;
	}

	let result = '';
	let i = 0;
	const len = text.length;

	while (i < len) {
		if (text[i] === '<') {
			let isU = false;
			let isIns = false;
			let tagEnd = -1;

			if (
				(text[i + 1] === 'u' || text[i + 1] === 'U') &&
				(text[i + 2] === '>' || text[i + 2] === ' ' || text[i + 2] === '\t' || text[i + 2] === '\n')
			) {
				tagEnd = text.indexOf('>', i + 2);
				if (tagEnd !== -1) isU = true;
			} else if (
				text.slice(i + 1, i + 4).toLowerCase() === 'ins' &&
				(text[i + 4] === '>' || text[i + 4] === ' ' || text[i + 4] === '\t' || text[i + 4] === '\n')
			) {
				tagEnd = text.indexOf('>', i + 4);
				if (tagEnd !== -1) isIns = true;
			}

			if (isU || isIns) {
				const closeTag = isU ? '</u>' : '</ins>';
				const contentStart = tagEnd + 1;
				const lowerText = text.toLowerCase();
				const closePos = lowerText.indexOf(closeTag, contentStart);

				if (closePos !== -1) {
					const innerContent = text.slice(contentStart, closePos);
					result += `_${innerContent}_`;
					i = closePos + closeTag.length;
					continue;
				}
			}
		}

		result += text[i];
		i++;
	}

	return result;
}

export function Markdown({content, style}: {content: string; style?: MarkdownStyle}) {
	const normalizedContent = useMemo(() => {
		if (!content) return '';
		return normalizeUnderlineTags(content);
	}, [content]);

	const combinedStyle = useMemo<MarkdownStyle>(
		() => ({
			paragraph: {
				fontSize: 16,
				lineHeight: 24,
				color: '#334155',
				marginBottom: 12,
			},
			h1: {
				fontSize: 22,
				fontWeight: '700',
				color: '#0f172a',
				marginTop: 18,
				marginBottom: 10,
			},
			h2: {
				fontSize: 18,
				fontWeight: '700',
				color: '#0f172a',
				marginTop: 16,
				marginBottom: 8,
			},
			h3: {
				fontSize: 16,
				fontWeight: '600',
				color: '#0f172a',
				marginTop: 12,
				marginBottom: 6,
			},
			list: {
				fontSize: 16,
				lineHeight: 24,
				color: '#334155',
				bulletColor: '#0088cc',
				markerColor: '#0088cc',
				markerFontWeight: '600',
				itemSpacing: 6,
				marginBottom: 12,
			},
			strong: {
				fontWeight: 'bold',
				color: '#0f172a',
			},
			em: {
				fontStyle: 'italic',
				color: '#334155',
			},
			link: {
				color: '#0088cc',
				underline: true,
			},
			blockquote: {
				backgroundColor: '#f8fafc',
				borderColor: '#cbd5e1',
				borderWidth: 4,
				padding: 12,
				borderRadius: 4,
				marginTop: 8,
				marginBottom: 8,
				color: '#334155',
			},
			code: {
				backgroundColor: '#f1f5f9',
				borderColor: '#e2e8f0',
				color: '#0f172a',
				fontSize: 14,
			},
			codeBlock: {
				backgroundColor: '#f1f5f9',
				borderColor: '#e2e8f0',
				borderWidth: 1,
				borderRadius: 4,
				padding: 12,
				color: '#0f172a',
				fontSize: 14,
			},
			underline: {
				color: '#334155',
			},
			...(style || {}),
		}),
		[style],
	);

	return (
		<EnrichedMarkdownText
			flavor="github"
			markdown={normalizedContent}
			markdownStyle={combinedStyle}
			md4cFlags={{underline: true}}
			onLinkPress={({url}: LinkPressEvent) => {
				if (url) {
					Linking.openURL(url).catch(() => {});
				}
			}}
		/>
	);
}
