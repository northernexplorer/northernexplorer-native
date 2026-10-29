import React, {useRef, useState, useCallback} from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	NativeSyntheticEvent,
	TextInputSelectionChangeEvent,
	Platform,
} from 'react-native';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';

export interface FormattedTextAreaProps<T extends string> {
	fieldName: T;
	label: string;
	placeholder: string;
	updateField: (name: T, value: string) => void;
	value?: string;
	error?: string;
	loading?: boolean;
	numberOfLines?: number;
	minHeight?: number;
	renderPreview?: (content: string) => React.ReactNode;
	helperText?: string;
}

export function FormattedTextAreaField<T extends string>({
	fieldName,
	label,
	placeholder,
	updateField,
	value = '',
	error,
	loading,
	numberOfLines = 8,
	minHeight = 160,
	renderPreview,
	helperText,
}: FormattedTextAreaProps<T>) {
	const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
	const [selection, setSelection] = useState<{start: number; end: number}>({start: 0, end: 0});
	const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

	const handleSelectionChange = useCallback((e: NativeSyntheticEvent<TextInputSelectionChangeEvent['nativeEvent']>) => {
		setSelection(e.nativeEvent.selection);
	}, []);

	const applyWrap = useCallback(
		(prefix: string, suffix: string, defaultText: string) => {
			const text = value || '';
			const start = Math.min(selection.start, selection.end);
			const end = Math.max(selection.start, selection.end);
			const selectedText = text.substring(start, end);

			let newText = '';

			if (start !== end && selectedText.length > 0) {
				// Wrap selected text
				newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
			} else {
				// Insert placeholder text wrapped
				newText = text.substring(0, start) + prefix + defaultText + suffix + text.substring(start);
			}

			updateField(fieldName, newText);
			setTimeout(() => {
				inputRef.current?.focus();
			}, 50);
		},
		[fieldName, selection, updateField, value],
	);

	const applyLinePrefix = useCallback(
		(prefix: string, mode: 'prefix' | 'numbered' = 'prefix') => {
			const text = value || '';
			const start = Math.min(selection.start, selection.end);
			const end = Math.max(selection.start, selection.end);

			// Find start of first affected line
			const firstLineStart = text.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
			// Find end of last affected line
			const nextNewline = text.indexOf('\n', end);
			const lastLineEnd = nextNewline === -1 ? text.length : nextNewline;

			const beforeBlock = text.substring(0, firstLineStart);
			const targetBlock = text.substring(firstLineStart, lastLineEnd);
			const afterBlock = text.substring(lastLineEnd);

			const lines = targetBlock.split('\n');
			const transformedLines = lines.map((line, index) => {
				if (mode === 'numbered') {
					const numPrefix = `${index + 1}. `;
					// Check if already numbered
					if (/^\d+\.\s/.test(line)) {
						return line.replace(/^\d+\.\s/, '');
					}
					return numPrefix + line;
				}

				if (line.startsWith(prefix)) {
					// Toggle off prefix
					return line.substring(prefix.length);
				}
				return prefix + line;
			});

			const newTargetBlock = transformedLines.join('\n');
			const newText = beforeBlock + newTargetBlock + afterBlock;

			updateField(fieldName, newText);
			setTimeout(() => {
				inputRef.current?.focus();
			}, 50);
		},
		[fieldName, selection, updateField, value],
	);

	const applyIndent = useCallback(
		(indentStr = '    ') => {
			const text = value || '';
			const start = Math.min(selection.start, selection.end);
			const end = Math.max(selection.start, selection.end);

			if (start === end) {
				// Simply insert spaces at cursor
				const newText = text.substring(0, start) + indentStr + text.substring(start);
				updateField(fieldName, newText);
			} else {
				// Indent all selected lines
				const firstLineStart = text.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
				const nextNewline = text.indexOf('\n', end);
				const lastLineEnd = nextNewline === -1 ? text.length : nextNewline;

				const beforeBlock = text.substring(0, firstLineStart);
				const targetBlock = text.substring(firstLineStart, lastLineEnd);
				const afterBlock = text.substring(lastLineEnd);

				const lines = targetBlock.split('\n');
				const indented = lines.map(line => indentStr + line).join('\n');
				const newText = beforeBlock + indented + afterBlock;
				updateField(fieldName, newText);
			}

			setTimeout(() => {
				inputRef.current?.focus();
			}, 50);
		},
		[fieldName, selection, updateField, value],
	);

	const applyOutdent = useCallback(() => {
		const text = value || '';
		const start = Math.min(selection.start, selection.end);
		const end = Math.max(selection.start, selection.end);

		const firstLineStart = text.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
		const nextNewline = text.indexOf('\n', end);
		const lastLineEnd = nextNewline === -1 ? text.length : nextNewline;

		const beforeBlock = text.substring(0, firstLineStart);
		const targetBlock = text.substring(firstLineStart, lastLineEnd);
		const afterBlock = text.substring(lastLineEnd);

		const lines = targetBlock.split('\n');
		const outdented = lines
			.map(line => {
				if (line.startsWith('\t')) {
					return line.substring(1);
				}
				// Remove up to 4 leading spaces
				const match = line.match(/^ {1,4}/);
				if (match) {
					return line.substring(match[0].length);
				}
				return line;
			})
			.join('\n');

		const newText = beforeBlock + outdented + afterBlock;
		updateField(fieldName, newText);

		setTimeout(() => {
			inputRef.current?.focus();
		}, 50);
	}, [fieldName, selection, updateField, value]);

	const handleKeyDown = (e: {key: string; shiftKey: boolean; preventDefault: () => void}) => {
		if (Platform.OS === 'web' && e.key === 'Tab') {
			e.preventDefault();
			if (e.shiftKey) {
				applyOutdent();
			} else {
				applyIndent();
			}
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text style={styles.label}>{label}</Text>

				<View style={styles.tabToggle}>
					<TouchableOpacity
						style={[styles.tabButton, activeTab === 'write' && styles.tabButtonActive]}
						onPress={() => setActiveTab('write')}
						disabled={loading}
					>
						<Ionicons name="pencil" size={13} color={activeTab === 'write' ? '#0088cc' : '#64748b'} />
						<Text style={[styles.tabButtonText, activeTab === 'write' && styles.tabButtonTextActive]}>Write</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.tabButton, activeTab === 'preview' && styles.tabButtonActive]}
						onPress={() => setActiveTab('preview')}
						disabled={loading}
					>
						<Ionicons name="eye-outline" size={13} color={activeTab === 'preview' ? '#0088cc' : '#64748b'} />
						<Text style={[styles.tabButtonText, activeTab === 'preview' && styles.tabButtonTextActive]}>Preview</Text>
					</TouchableOpacity>
				</View>
			</View>

			{activeTab === 'write' ? (
				<View style={[styles.editorWrapper, loading && styles.disabledWrapper]}>
					{/* Formatting Toolbar */}
					<View style={styles.toolbarContainer}>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbar}>
							{/* Bold */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyWrap('**', '**', 'bold text')}
								disabled={loading}
								accessibilityLabel="Bold"
							>
								<Text style={[styles.toolButtonText, {fontWeight: '800'}]}>B</Text>
							</TouchableOpacity>

							{/* Italic */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyWrap('*', '*', 'italic text')}
								disabled={loading}
								accessibilityLabel="Italic"
							>
								<Text style={[styles.toolButtonText, {fontStyle: 'italic', fontFamily: 'serif'}]}>I</Text>
							</TouchableOpacity>

							{/* Underline */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyWrap('<u>', '</u>', 'underlined text')}
								disabled={loading}
								accessibilityLabel="Underline"
							>
								<Text style={[styles.toolButtonText, {textDecorationLine: 'underline'}]}>U</Text>
							</TouchableOpacity>

							<View style={styles.toolDivider} />

							{/* Heading */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyLinePrefix('### ')}
								disabled={loading}
								accessibilityLabel="Heading"
							>
								<Text style={[styles.toolButtonText, {fontWeight: '700', fontSize: 13}]}>H3</Text>
							</TouchableOpacity>

							{/* Bullet List */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyLinePrefix('- ')}
								disabled={loading}
								accessibilityLabel="Bullet List"
							>
								<MaterialCommunityIcons name="format-list-bulleted" size={18} color="#334155" />
							</TouchableOpacity>

							{/* Numbered List */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyLinePrefix('', 'numbered')}
								disabled={loading}
								accessibilityLabel="Numbered List"
							>
								<MaterialCommunityIcons name="format-list-numbered" size={18} color="#334155" />
							</TouchableOpacity>

							<View style={styles.toolDivider} />

							{/* Indent / Tab */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyIndent()}
								disabled={loading}
								accessibilityLabel="Indent / Tab"
							>
								<MaterialCommunityIcons name="format-indent-increase" size={18} color="#334155" />
							</TouchableOpacity>

							{/* Outdent */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyOutdent()}
								disabled={loading}
								accessibilityLabel="Outdent"
							>
								<MaterialCommunityIcons name="format-indent-decrease" size={18} color="#334155" />
							</TouchableOpacity>

							<View style={styles.toolDivider} />

							{/* Blockquote */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyLinePrefix('> ')}
								disabled={loading}
								accessibilityLabel="Quote"
							>
								<MaterialCommunityIcons name="format-quote-close" size={18} color="#334155" />
							</TouchableOpacity>

							{/* Link */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyWrap('[', '](https://example.com)', 'Link text')}
								disabled={loading}
								accessibilityLabel="Link"
							>
								<Ionicons name="link-outline" size={16} color="#334155" />
							</TouchableOpacity>

							{/* Code */}
							<TouchableOpacity
								style={styles.toolButton}
								onPress={() => applyWrap('`', '`', 'code')}
								disabled={loading}
								accessibilityLabel="Inline Code"
							>
								<Ionicons name="code-slash-outline" size={16} color="#334155" />
							</TouchableOpacity>
						</ScrollView>
					</View>

					{/* Multiline Input */}
					<TextInput
						ref={inputRef}
						style={[styles.input, {minHeight}, loading && styles.disabledInput]}
						placeholder={placeholder}
						value={value}
						onChangeText={val => updateField(fieldName, val)}
						onSelectionChange={handleSelectionChange}
						editable={!loading}
						placeholderTextColor="#94a3b8"
						multiline
						numberOfLines={numberOfLines}
						textAlignVertical="top"
						blurOnSubmit={false}
						submitBehavior="newline"
						// @ts-expect-error - web keyboard intercept
						onKeyDown={handleKeyDown}
					/>
				</View>
			) : (
				<View style={[styles.previewWrapper, {minHeight}]}>
					{value && value.trim().length > 0 ? (
						renderPreview ? (
							renderPreview(value)
						) : (
							<Text style={styles.previewPlainText}>{value}</Text>
						)
					) : (
						<View style={styles.previewEmptyContainer}>
							<Ionicons name="document-text-outline" size={28} color="#cbd5e1" />
							<Text style={styles.previewEmptyText}>Nothing to preview yet. Switch to Write tab to compose description.</Text>
						</View>
					)}
				</View>
			)}

			<View style={styles.footerRow}>
				{error ? <Text style={styles.errorText}>{error}</Text> : null}
				<Text style={styles.hintText}>
					{helperText || 'Supports rich markdown: **bold**, <u>underline</u>, *italic*, bullet lists, and indenting.'}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 6,
		marginBottom: 4,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
		color: '#1e293b',
	},
	tabToggle: {
		flexDirection: 'row',
		backgroundColor: '#f1f5f9',
		borderRadius: 6,
		padding: 2,
		gap: 2,
	},
	tabButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
	},
	tabButtonActive: {
		backgroundColor: '#ffffff',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 1,
	},
	tabButtonText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#64748b',
	},
	tabButtonTextActive: {
		color: '#0088cc',
		fontWeight: '600',
	},
	editorWrapper: {
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 8,
		backgroundColor: '#fefefe',
		overflow: 'hidden',
	},
	disabledWrapper: {
		opacity: 0.6,
		backgroundColor: '#f8fafc',
	},
	toolbarContainer: {
		backgroundColor: '#f8fafc',
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
		paddingVertical: 4,
		paddingHorizontal: 6,
	},
	toolbar: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	toolButton: {
		minWidth: 28,
		height: 28,
		paddingHorizontal: 6,
		borderRadius: 4,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	toolButtonText: {
		fontSize: 14,
		color: '#334155',
	},
	toolDivider: {
		width: 1,
		height: 18,
		backgroundColor: '#cbd5e1',
		marginHorizontal: 2,
	},
	input: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 15,
		lineHeight: 22,
		color: '#0f172a',
		backgroundColor: '#ffffff',
	},
	disabledInput: {
		backgroundColor: '#f8fafc',
	},
	previewWrapper: {
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 8,
		backgroundColor: '#ffffff',
		padding: 14,
		justifyContent: 'flex-start',
	},
	previewPlainText: {
		fontSize: 15,
		lineHeight: 22,
		color: '#334155',
	},
	previewEmptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 24,
		gap: 8,
	},
	previewEmptyText: {
		fontSize: 13,
		color: '#94a3b8',
		textAlign: 'center',
	},
	footerRow: {
		flexDirection: 'column',
		gap: 2,
		marginTop: 2,
	},
	errorText: {
		color: '#ef4444',
		fontSize: 12,
		fontWeight: '500',
	},
	hintText: {
		color: '#64748b',
		fontSize: 12,
	},
});
