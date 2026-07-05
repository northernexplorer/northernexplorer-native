import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { styles } from '~/user/styles';
import { Link } from 'expo-router';

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
            <Link href="/profile" asChild>
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
            </Link>
            <Link href="/profile/forgot-password" asChild>
                <Pressable>
                    <Text style={styles.link}>Forgot Password?</Text>
                </Pressable>
            </Link>
            <Link href="/profile/register" asChild>
                <Pressable>
                    <Text style={styles.link}>Create Account</Text>
                </Pressable>
            </Link>
        </View>
    );
}
