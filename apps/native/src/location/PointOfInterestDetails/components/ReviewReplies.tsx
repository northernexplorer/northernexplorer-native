import {Ionicons} from '@expo/vector-icons';
import {ReviewReplyType} from '@northernexplorer/types';
import {formatDate, formatName} from '@northernexplorer/tools-web';
import {Link, useRouter} from 'expo-router';
import {ComponentRef, useContext, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {ScrollContext} from '~/layout/Layout/ScrollContext';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

type ReviewRepliesProps = {
	reviewId: string;
	targetReplyId?: string;
};

export function ReviewReplies({reviewId, targetReplyId}: ReviewRepliesProps) {
	const authentication = useAuthentication();
	const router = useRouter();
	const scrollToTarget = useContext(ScrollContext);
	const targetRef = useRef<ComponentRef<typeof View>>(null);
	const [replyingTo, setReplyingTo] = useState<string | null | undefined>(undefined);
	const [text, setText] = useState('');
	const {data, loading, refetch} = useApiFetch('location', 'ReviewController', 'getReplies', {reviewId});
	const createReplyMutation = useApiMutation('location', 'ReviewController', 'createReply');
	const replies = data ?? [];
	const repliesByParent = new Map<string | null, ReviewReplyType[]>();
	const targetExists = replies.some(reply => reply.id === targetReplyId);

	useEffect(() => {
		if (!targetReplyId || !targetExists) return;
		const frame = requestAnimationFrame(() => {
			if (targetRef.current) scrollToTarget(targetRef.current);
		});
		return () => cancelAnimationFrame(frame);
	}, [targetReplyId, targetExists, scrollToTarget]);

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
				<Text style={styles.characterCount}>{text.length}/2000</Text>
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
		const isTarget = reply.id === targetReplyId;
		return (
			<View key={reply.id} style={[styles.reply, {marginLeft: reply.depth > 1 ? 14 : 0}]}>
				<View ref={isTarget ? targetRef : undefined} collapsable={false} style={[styles.replyCard, isTarget && styles.targetReply]}>
					<View style={styles.replyHeader}>
						<Pressable onPress={() => router.push(`/user/${reply.user.username}`)} accessibilityRole="link">
							<Text style={styles.author}>{formatName(reply.user)}</Text>
						</Pressable>
						<Text style={styles.date}>{formatDate(reply.createdAt)}</Text>
					</View>
					<Text style={styles.replyText}>{reply.text}</Text>
					<View style={styles.replyActions}>
						{authentication?.userId && reply.depth < 3 && replyingTo === undefined && (
							<Pressable onPress={() => setReplyingTo(reply.id)} style={styles.replyAction} accessibilityRole="button">
								<Ionicons name="return-down-forward-outline" size={14} color="#0088cc" />
								<Text style={styles.replyActionText}>Reply</Text>
							</Pressable>
						)}
					</View>
				</View>
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
			{!authentication?.userId && (
				<Link href="/user/login" style={styles.signIn}>
					Sign in to join the conversation
				</Link>
			)}
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
		paddingVertical: 4,
	},
	replyCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		padding: 10,
	},
	targetReply: {
		backgroundColor: '#e0f2fe',
		borderWidth: 1,
		borderColor: '#38bdf8',
	},
	replyHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 8,
	},
	author: {
		fontSize: 12,
		fontWeight: '700',
		color: '#0f172a',
	},
	replyText: {
		fontSize: 13,
		color: '#334155',
		marginTop: 6,
		lineHeight: 19,
	},
	date: {
		fontSize: 11,
		color: '#64748b',
	},
	replyActions: {
		flexDirection: 'row',
		gap: 16,
		marginTop: 4,
	},
	signIn: {
		fontSize: 12,
		color: '#0088cc',
		marginTop: 8,
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
	characterCount: {
		fontSize: 11,
		color: '#64748b',
		marginRight: 'auto',
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
