import {Text, View} from 'react-native';
import React from 'react';

export function Compass() {
	return (
		<View>
			<Text
				style={{
					color: 'rgba(255,255,255,0.9)',
					fontSize: 18,
					lineHeight: 28,
					textAlign: 'center',
					fontStyle: 'italic',
				}}
			>
				Compass
			</Text>
		</View>
	);
}