import React from 'react';
import {View, Text} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {styles} from '~/layout/Home/styles';
import {useLunar} from '~/environment/state/lunar/useLunar';
import {Spinner} from '~/layout/Layout/components/Spinner';
import {getMoonIcon} from '~/environment/lib/getMoonIcon';

export function Lunar() {
	const lunar = useLunar();

	if (!lunar) return <Spinner />;

	const icon = getMoonIcon(lunar);

	return (
		<View style={[styles.tile, {padding: 16, alignItems: 'center', justifyContent: 'center', flex: 1, marginRight: 0}]}>
			<MaterialCommunityIcons name={icon} size={56} color="#ffffff" style={{marginBottom: 8}} />
			<Text style={{color: '#ffffff', fontSize: 13, fontWeight: '600', textAlign: 'center'}} numberOfLines={1}>
				{lunar.phase_name}
			</Text>
			<Text style={{color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>
				{Math.round(lunar.illumination_percentage)}% Illum.
			</Text>
		</View>
	);
}
