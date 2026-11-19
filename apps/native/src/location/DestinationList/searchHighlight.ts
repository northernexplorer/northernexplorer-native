export function getSearchExcerpt(text: string, query: string, context = 20): string {
	const term = query.trim();
	if (!term) return text;
	const index = text.toLowerCase().indexOf(term.toLowerCase());
	if (index < 0) return text;
	const start = Math.max(0, index - context);
	const end = Math.min(text.length, index + term.length + context);
	return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

export function splitSearchMatches(text: string, query: string): {text: string; match: boolean}[] {
	const term = query.trim();
	if (!term) return [{text, match: false}];
	const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
	const parts: {text: string; match: boolean}[] = [];
	let lastIndex = 0;
	for (const match of text.matchAll(pattern)) {
		const index = match.index;
		if (index > lastIndex) parts.push({text: text.slice(lastIndex, index), match: false});
		parts.push({text: match[0], match: true});
		lastIndex = index + match[0].length;
	}
	if (lastIndex < text.length) parts.push({text: text.slice(lastIndex), match: false});
	return parts;
}
