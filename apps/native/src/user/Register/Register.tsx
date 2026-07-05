import { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { styles } from '~/user/styles';

export function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleRegister = () => {
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        console.log({
            firstName,
            lastName,
            userName,
            email,
            password,
            acceptTerms,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.field}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    value={userName}
                    onChangeText={setUserName}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Username"
                    style={styles.input}
                />
            </View>

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

            <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="Confirm Password"
                    style={styles.input}
                />
            </View>

            <View style={styles.switchRow}>
                <Text style={styles.label}>I accept the Terms of Service</Text>
                <Switch value={acceptTerms} onValueChange={setAcceptTerms} />
            </View>

            <Pressable
                style={[styles.button, !acceptTerms && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={!acceptTerms}
            >
                <Text style={styles.buttonText}>Create Account</Text>
            </Pressable>

            <Pressable>
                <Text style={styles.link}>Already have an account? Sign In</Text>
            </Pressable>
        </View>
    );
}
