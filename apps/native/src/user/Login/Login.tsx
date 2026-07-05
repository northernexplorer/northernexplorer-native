import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Switch } from 'react-native';

export function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        console.log({
            identifier,
            password,
            rememberMe,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Username or Email</Text>
                <TextInput
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    placeholder="Username or Email"
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Password"
                    style={styles.input}
                />
            </View>

            <View style={styles.rememberRow}>
                <Text style={styles.label}>Remember Me</Text>
                <Switch value={rememberMe} onValueChange={setRememberMe} />
            </View>

            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>

            <Pressable>
                <Text style={styles.link}>Forgot Password?</Text>
            </Pressable>

            <Pressable>
                <Text style={styles.link}>Create Account</Text>
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
    rememberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
