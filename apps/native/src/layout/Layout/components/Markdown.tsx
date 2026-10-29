import NativeMarkdown, {MarkdownIt, ASTNode, RenderRules} from 'react-native-markdown-display';
import React, {ReactNode, useMemo} from 'react';
import {Text, ViewStyle, TextStyle} from 'react-native';

const markdownIt = MarkdownIt({
	typographer: true,
	html: true,
});

type MarkdownItState = {
	src: string;
	pos: number;
	posMax: number;
	push: (type: string, tag: string, nesting: number) => {content?: string};
	md: {inline: {tokenize: (state: MarkdownItState) => void}};
};

markdownIt.inline.ruler.before('emphasis', 'underline', (state: MarkdownItState, silent: boolean) => {
	const marker = 0x3c; // '<'
	if (state.src.charCodeAt(state.pos) !== marker) return false;
	const slice = state.src.slice(state.pos);
	const match = slice.match(/^<(?:u|ins)(?:>|\s[^>]*>)([\s\S]+?)<\/(?:u|ins)>/i);
	if (!match) return false;
	const fullLength = match[0].length;
	const openTagLength = match[0].indexOf('>') + 1;
	const innerText = match[1];

	if (!silent) {
		state.push('underline_open', 'u', 1);
		const oldPos = state.pos;
		const oldMax = state.posMax;
		state.pos = oldPos + openTagLength;
		state.posMax = state.pos + innerText.length;
		state.md.inline.tokenize(state);
		state.pos = oldPos + fullLength;
		state.posMax = oldMax;
		state.push('underline_close', 'u', -1);
	} else {
		state.pos += fullLength;
	}
	return true;
});

const customRules: RenderRules = {
	underline: (node: ASTNode, children: ReactNode[]) => (
		<Text key={node.key} style={{textDecorationLine: 'underline'}}>
			{children}
		</Text>
	),
};

export function Markdown({content, style}: {content: string; style?: Record<string, ViewStyle | TextStyle>}) {
	const combinedStyle = useMemo(
		() => ({
			body: {
				fontSize: 16,
				lineHeight: 24,
				color: '#334155',
			},
			heading1: {
				fontSize: 22,
				fontWeight: '700' as const,
				color: '#0f172a',
				marginTop: 18,
				marginBottom: 10,
			},
			heading2: {
				fontSize: 18,
				fontWeight: '700' as const,
				color: '#0f172a',
				marginTop: 16,
				marginBottom: 8,
			},
			heading3: {
				fontSize: 16,
				fontWeight: '600' as const,
				color: '#0f172a',
				marginTop: 12,
				marginBottom: 6,
			},
			paragraph: {
				marginBottom: 12,
				color: '#334155',
			},
			list_item: {
				marginBottom: 6,
			},
			bullet_list_icon: {
				color: '#0088cc',
				marginRight: 8,
				fontSize: 16,
			},
			ordered_list_icon: {
				color: '#0088cc',
				marginRight: 8,
				fontWeight: '600' as const,
				fontSize: 15,
			},
			strong: {
				fontWeight: '700' as const,
				color: '#0f172a',
			},
			em: {
				fontStyle: 'italic' as const,
				color: '#334155',
			},
			link: {
				color: '#0088cc',
				textDecorationLine: 'underline' as const,
			},
			blockquote: {
				backgroundColor: '#f8fafc',
				borderColor: '#cbd5e1',
				borderLeftWidth: 4,
				paddingHorizontal: 12,
				paddingVertical: 8,
				marginVertical: 8,
				borderRadius: 4,
			},
			code_inline: {
				backgroundColor: '#f1f5f9',
				borderColor: '#e2e8f0',
				borderWidth: 1,
				color: '#0f172a',
				paddingHorizontal: 6,
				paddingVertical: 2,
				borderRadius: 4,
				fontSize: 14,
			},
			...(style || {}),
		}),
		[style],
	);

	return (
		<NativeMarkdown markdownit={markdownIt} rules={customRules} style={combinedStyle}>
			{content}
		</NativeMarkdown>
	);
}
