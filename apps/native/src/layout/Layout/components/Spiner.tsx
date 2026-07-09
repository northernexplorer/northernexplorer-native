import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

export function Spinner() {
    return <ActivityIndicator size="large" color="#0088cc" style={styles.centerSpinner} />;
}

const styles = StyleSheet.create({
    centerSpinner: {
        marginTop: 40,
        alignSelf: 'center',
    },
});
