import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { styles } from '~/user/styles';
import { Link } from 'expo-router';

export function Login() {
    const [loginData, setLoginData] = useState({
        identifier: '',
        password: '',
        rememberMe: false,
    });

    const updateLoginField = (key: keyof typeof loginData, value: string | boolean) => {
        setLoginData((prev) => ({ ...prev, [key]: value }));
    };

    const handleLogin = () => {
        console.log(loginData);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Username or Email</Text>
                <TextInput
                    value={loginData.identifier}
                    onChangeText={(val) => updateLoginField('identifier', val)}
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
                    value={loginData.password}
                    onChangeText={(val) => updateLoginField('password', val)}
                    secureTextEntry
                    placeholder="Password"
                    style={styles.input}
                />
            </View>

            <View style={styles.rememberRow}>
                <Text style={styles.label}>Remember Me</Text>
                <Switch
                    value={loginData.rememberMe}
                    onValueChange={(val) => updateLoginField('rememberMe', val)}
                />
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
