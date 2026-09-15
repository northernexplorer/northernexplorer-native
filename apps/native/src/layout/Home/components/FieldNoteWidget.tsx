import React from 'react';
import {Text, Pressable, View} from 'react-native';
import {Link} from 'expo-router';
import {FieldNoteType} from '@northernexplorer/types';
import {styles} from '~/layout/Home/styles';

export function FieldNoteWidget({data}: {data: FieldNoteType}) {
	return (
		<Link href="/environment/field-note" asChild>
			<Pressable
				style={{
					...styles.tile,
					padding: 16,
					flex: 1,
					justifyContent: 'space-between',
				}}
			>
				<View>
					<Text style={styles.hourDay} numberOfLines={1}>
						Field Note
					</Text>

					<Text
						style={{
							color: '#FFFFFF',
							fontSize: 14,
							fontWeight: '700',
							lineHeight: 20,
							marginTop: 6,
							fontStyle: 'italic',
						}}
						numberOfLines={2}
					>
						"{data.title}"
					</Text>
				</View>

				{data.body ? (
					<Text
						style={{
							color: '#94A3B8',
							fontSize: 12,
							lineHeight: 16,
							marginTop: 6,
						}}
						numberOfLines={2}
					>
						{data.body}
					</Text>
				) : null}
			</Pressable>
		</Link>
	);
}
