import React from 'react';
import {View, Text} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {LunarCycleType} from '@northernexplorer/types';
import {styles} from '~/layout/Home/styles';

function getMoonIcon(data: LunarCycleType) {
	const illum = data.illumination_percentage;

	if (illum < 5) return 'moon-new';
	if (illum < 25) return data.is_waxing ? 'moon-waxing-crescent' : 'moon-waning-crescent';
	if (illum < 45) return data.is_waxing ? 'moon-first-quarter' : 'moon-last-quarter';
	if (illum < 75) return data.is_waxing ? 'moon-waxing-gibbous' : 'moon-waning-gibbous';
	return 'moon-full';
}

export function LunarWidget({data}: {data: LunarCycleType}) {
	const icon = getMoonIcon(data);

	return (
		<View style={[styles.tile, {padding: 16, alignItems: 'center', justifyContent: 'center', flex: 1, marginRight: 0}]}>
			<MaterialCommunityIcons name={icon} size={56} color="#ffffff" style={{marginBottom: 8}} />
			<Text style={{color: '#ffffff', fontSize: 13, fontWeight: '600', textAlign: 'center'}} numberOfLines={1}>
				{data.phase_name}
			</Text>
			<Text style={{color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>
				{Math.round(data.illumination_percentage)}% Illum.
			</Text>
		</View>
	);
}
