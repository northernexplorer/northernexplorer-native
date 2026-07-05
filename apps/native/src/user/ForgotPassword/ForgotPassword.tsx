import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        console.log({ email });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>

            <Text style={styles.description}>
                Enter the email address associated with your account and we'll
                send you instructions to reset your password.
            </Text>

            <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    placeholder="Email Address"
                    style={styles.input}
                />
            </View>

            <Pressable
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Send Reset Link</Text>
            </Pressable>

            <Pressable>
                <Text style={styles.link}>Back to Sign In</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        padding: 24,
        gap: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        color: '#666',
        lineHeight: 22,
    },
    field: {
        gap: 6,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        color: '#2563eb',
        textAlign: 'center',
        fontSize: 15,
    },
});