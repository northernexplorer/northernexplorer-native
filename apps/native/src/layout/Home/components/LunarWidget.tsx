import React from 'react';
import {Text, Pressable} from 'react-native';
import {Link} from 'expo-router';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {LunarCycleType} from '@northernexplorer/types';
import {styles} from '~/layout/Home/styles';
import {getMoonIcon} from '~/environment/lib/getMoonIcon';

export function LunarWidget({data}: {data: LunarCycleType}) {
	const icon = getMoonIcon(data);

	return (
		<Link href="/environment/lunar" asChild>
			<Pressable
				style={{
					...styles.tile,
					padding: 16,
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
					marginRight: 0,
				}}
			>
				<MaterialCommunityIcons name={icon} size={56} color="#ffffff" style={{marginBottom: 8}} />
				<Text style={{color: '#ffffff', fontSize: 13, fontWeight: '600', textAlign: 'center'}} numberOfLines={1}>
					{data.phase_name}
				</Text>
				<Text style={{color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2, fontWeight: '500'}}>
					{Math.round(data.illumination_percentage)}% Illum.
				</Text>
			</Pressable>
		</Link>
	);
}
