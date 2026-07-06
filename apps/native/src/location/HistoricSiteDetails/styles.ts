import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    centerSpinner: {
        marginTop: 40,
        alignSelf: 'center',
    },
    banner: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: 24,
    },
    breadcrumbs: {
        color: '#0088cc',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        color: '#1a1a1a',
        fontSize: 26,
        fontWeight: '700',
        marginTop: 8,
    },
    coordinatesLabel: {
        color: '#1a1a1a',
        fontSize: 13,
        marginTop: 6,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    divider: {
        height: 1,
        backgroundColor: '#333333',
        marginVertical: 20,
    },
    body: {
        fontSize: 16,
        lineHeight: 26,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        padding: 24,
    },
});
