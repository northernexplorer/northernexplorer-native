import NativeMarkdown from 'react-native-markdown-display';

export function Markdown({content}: {content: string}) {
	return (
		<NativeMarkdown
			style={{
				body: {
					fontSize: 16,
					lineHeight: 24,
				},
				heading1: {
					fontSize: 22,
					marginTop: 20,
					marginBottom: 10,
				},
				heading2: {
					fontSize: 18,
					marginTop: 18,
					marginBottom: 8,
				},
				paragraph: {
					marginBottom: 12,
				},
				list_item: {
					marginBottom: 6,
				},
				strong: {
					color: 'white',
				},
			}}
		>
			{content}
		</NativeMarkdown>
	);
}
