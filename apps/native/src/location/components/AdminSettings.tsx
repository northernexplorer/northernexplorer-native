import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {RolesEnum} from '@northernexplorer/types';
import {SwitchField} from '@northernexplorer/tools-web';
import {setShowDrafts} from '~/location/state/map/mapSlice';
import {useMap} from '~/location/state/map/useMap';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

export function AdminSettings({description}: {description: string}) {
	const dispatch = useDispatch();
	const authentication = useAuthentication();
	const {showDrafts = false} = useMap();

	if (!authentication?.roles?.includes(RolesEnum.Admin)) {
		return null;
	}

	return (
		<View style={styles.adminSection}>
			<View style={styles.adminHeader}>
				<MaterialCommunityIcons name="shield-outline" size={16} color="#f59e0b" />
				<Text style={styles.adminTitle}>Admin Options</Text>
			</View>
			<SwitchField
				fieldName="showDrafts"
				label="Show Draft Sites"
				description={description}
				value={showDrafts}
				updateField={(_name, val) => dispatch(setShowDrafts(val))}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	adminSection: {
		marginTop: 8,
		padding: 12,
		borderRadius: 12,
		backgroundColor: 'rgba(245, 158, 11, 0.06)',
		borderWidth: 1,
		borderColor: 'rgba(245, 158, 11, 0.2)',
		gap: 8,
	},
	adminHeader: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2},
	adminTitle: {fontSize: 12, fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 0.5},
});
