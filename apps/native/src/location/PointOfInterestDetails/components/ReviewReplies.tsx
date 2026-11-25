import {Ionicons} from '@expo/vector-icons';
import {ReviewReplyType} from '@northernexplorer/types';
import {formatName} from '@northernexplorer/tools-web';
import {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type ReviewRepliesProps = {
	reviewId: string;
};

export function ReviewReplies({reviewId}: ReviewRepliesProps) {
	const authentication = useAuthentication();
	const [replyingTo, setReplyingTo] = useState<string | null | undefined>(undefined);
	const [text, setText] = useState('');
	const {data, loading, refetch} = useApiFetch('location', 'ReviewController', 'getReplies', {reviewId});
	const createReplyMutation = useApiMutation('location', 'ReviewController', 'createReply');
	const replies = data ?? [];
	const repliesByParent = new Map<string | null, ReviewReplyType[]>();

	for (const reply of replies) {
		const parentReplies = repliesByParent.get(reply.parentId) ?? [];
		parentReplies.push(reply);
		repliesByParent.set(reply.parentId, parentReplies);
	}

	const submitReply = async () => {
		const trimmedText = text.trim();
		if (!trimmedText || replyingTo === undefined || createReplyMutation.loading) return;

		const createdReply = await createReplyMutation.mutate({
			reviewId,
			parentId: replyingTo,
			text: trimmedText,
		});
		if (!createdReply) return;

		setText('');
		setReplyingTo(undefined);
		await refetch();
	};

	const renderReplyForm = () => (
		<View style={styles.replyForm}>
			<TextInput
				accessibilityLabel="Write a reply"
				placeholder="Write a reply..."
				multiline
				maxLength={2000}
				value={text}
				onChangeText={setText}
				style={styles.replyInput}
			/>
			<View style={styles.formActions}>
				<Pressable onPress={() => setReplyingTo(undefined)} style={styles.cancelButton}>
					<Text style={styles.cancelText}>Cancel</Text>
				</Pressable>
				<Pressable
					onPress={submitReply}
					disabled={!text.trim() || createReplyMutation.loading}
					style={[styles.submitButton, (!text.trim() || createReplyMutation.loading) && styles.disabledButton]}
				>
					{createReplyMutation.loading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.submitText}>Send</Text>}
				</Pressable>
			</View>
		</View>
	);

	const renderReply = (reply: ReviewReplyType) => {
		const children = repliesByParent.get(reply.id) ?? [];
		return (
			<View key={reply.id} style={[styles.reply, {marginLeft: reply.depth > 1 ? 14 : 0}]}>
				<Text style={styles.author}>{formatName(reply.user)}</Text>
				<Text style={styles.replyText}>{reply.text}</Text>
				{authentication?.userId && reply.depth < 3 && replyingTo !== reply.id && (
					<Pressable onPress={() => setReplyingTo(reply.id)} style={styles.replyAction}>
						<Ionicons name="return-down-forward-outline" size={14} color="#0088cc" />
						<Text style={styles.replyActionText}>Reply</Text>
					</Pressable>
				)}
				{replyingTo === reply.id && renderReplyForm()}
				{children.map(renderReply)}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Replies ({replies.length})</Text>
				{authentication?.userId && replyingTo === undefined && (
					<Pressable onPress={() => setReplyingTo(null)} style={styles.replyAction}>
						<Ionicons name="chatbubble-outline" size={14} color="#0088cc" />
						<Text style={styles.replyActionText}>Reply</Text>
					</Pressable>
				)}
			</View>
			{replyingTo === null && renderReplyForm()}
			{loading && replies.length === 0 ? (
				<ActivityIndicator size="small" color="#0088cc" />
			) : replies.length === 0 ? (
				<Text style={styles.emptyText}>No replies yet.</Text>
			) : (
				<View style={styles.replyList}>{(repliesByParent.get(null) ?? []).map(renderReply)}</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 12,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: '#e2e8f0',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	title: {
		fontSize: 13,
		fontWeight: '700',
		color: '#334155',
	},
	replyList: {
		gap: 8,
		marginTop: 8,
	},
	reply: {
		borderLeftWidth: 2,
		borderLeftColor: '#cbd5e1',
		paddingLeft: 10,
		paddingVertical: 3,
	},
	author: {
		fontSize: 12,
		fontWeight: '700',
		color: '#0f172a',
	},
	replyText: {
		fontSize: 13,
		color: '#334155',
		marginTop: 3,
	},
	replyAction: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingVertical: 4,
	},
	replyActionText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#0088cc',
	},
	emptyText: {
		fontSize: 12,
		color: '#64748b',
		marginTop: 8,
	},
	replyForm: {
		marginTop: 8,
		gap: 6,
	},
	replyInput: {
		minHeight: 64,
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 8,
		fontSize: 13,
		textAlignVertical: 'top',
		color: '#0f172a',
	},
	formActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		gap: 8,
	},
	cancelButton: {
		paddingHorizontal: 10,
		paddingVertical: 7,
	},
	cancelText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#64748b',
	},
	submitButton: {
		minWidth: 58,
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderRadius: 6,
		backgroundColor: '#0088cc',
	},
	disabledButton: {
		backgroundColor: '#94a3b8',
	},
	submitText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#ffffff',
	},
});
