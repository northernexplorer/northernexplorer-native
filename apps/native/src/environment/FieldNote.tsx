import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '~/layout/Home/styles';
import {useFieldNote} from '~/environment/state/fieldNote/useFieldNote';
import {Spinner} from '~/layout/Layout/components/Spinner';

export function FieldNote() {
	const fieldNote = useFieldNote();

	if (!fieldNote) return <Spinner />;

	return (
		<View style={[styles.tile, {padding: 18, flex: 1, justifyContent: 'center', marginRight: 0}]}>
			<Text
				style={{
					color: 'rgba(255,255,255,0.5)',
					fontSize: 11,
					fontWeight: '700',
					textTransform: 'uppercase',
					letterSpacing: 0.8,
					marginBottom: 8,
				}}
			>
				Field Note
			</Text>
			<Text style={{color: '#ffffff', fontSize: 15, lineHeight: 22, fontWeight: '500', fontStyle: 'italic'}}>"{fieldNote.title}"</Text>
			{fieldNote.body ? (
				<Text style={{color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8, lineHeight: 18}} numberOfLines={3}>
					{fieldNote.body}
				</Text>
			) : null}
		</View>
	);
}
