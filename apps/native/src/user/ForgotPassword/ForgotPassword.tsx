import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { styles } from '~/user/styles';

export function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        console.log({ email });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>

            <Text style={styles.description}>
                Enter the email address associated with your account and we'll send you instructions
                to reset your password.
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

            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
            </Pressable>

            <Pressable>
                <Text style={styles.link}>Back to Sign In</Text>
            </Pressable>
        </View>
    );
}
