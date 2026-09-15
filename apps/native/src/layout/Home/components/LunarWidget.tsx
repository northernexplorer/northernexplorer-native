import React from 'react';
import {Text, Pressable, View} from 'react-native';
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
					justifyContent: 'space-between',
					flex: 1,
				}}
			>
				<Text style={styles.hourDay} numberOfLines={1}>
					Moon
				</Text>

				<View style={{alignItems: 'center', marginVertical: 6}}>
					<MaterialCommunityIcons name={icon} size={44} color="#38BDF8" />
				</View>

				<View style={{alignItems: 'center'}}>
					<Text style={{color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'center'}} numberOfLines={1}>
						{data.phase_name}
					</Text>
					<Text style={{color: '#94A3B8', fontSize: 11, marginTop: 2, fontWeight: '600'}}>
						{Math.round(data.illumination_percentage)}% Illum
					</Text>
				</View>
			</Pressable>
		</Link>
	);
}
