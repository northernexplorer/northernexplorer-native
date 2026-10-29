import {EnrichedMarkdownText, LinkPressEvent, MarkdownStyle} from 'react-native-enriched-markdown';
import React, {useMemo} from 'react';
import {Linking} from 'react-native';

export function Markdown({content, style}: {content: string; style?: MarkdownStyle}) {
	const normalizedContent = useMemo(() => {
		if (!content) return '';
		// Normalize <u> and <ins> tags to _text_ for underline parsing
		return content.replace(/<(?:u|ins)(?:>|\s[^>]*>)([\s\S]+?)<\/(?:u|ins)>/gi, '_$1_');
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
