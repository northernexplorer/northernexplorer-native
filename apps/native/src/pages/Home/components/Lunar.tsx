import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '~/pages/Home/styles';
import { LunarCycleType } from '~/state/hooks/lunar/getLunarCycle';

function getMoonIcon(data: LunarCycleType) {
  const illum = data.illumination_percentage;

  if (illum < 5) return 'moon-new';
  if (illum < 25) return data.is_waxing ? 'moon-waxing-crescent' : 'moon-waning-crescent';
  if (illum < 45) return data.is_waxing ? 'moon-first-quarter' : 'moon-last-quarter';
  if (illum < 75) return data.is_waxing ? 'moon-waxing-gibbous' : 'moon-waning-gibbous';
  return 'moon-full';
}

export function Lunar({ data }: { data: LunarCycleType }) {
  const icon = getMoonIcon(data);

  return (
    <View style={{ width: 160 }}>
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <MaterialCommunityIcons name={icon} size={72} color="rgba(255,255,255,0.9)" />
        <Text style={styles.condition}>{data.phase_name}</Text>
      </View>
    </View>
  );
}
