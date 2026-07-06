import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';

export function EditProfile() {
    const authentication = useAuthentication();
    if (!authentication) return <Redirect href="/profile/login" />;

    const user = {
        firstName: 'Shayne',
        lastName: 'Thiessen',
        userName: 'shayne',
        email: 'shayne@example.com',
    };

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [userName, setUserName] = useState(user.userName);
    const [email, setEmail] = useState(user.email);

    const handleSave = () => {
        console.log({
            firstName,
            lastName,
            userName,
            email,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
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
            <Link href="/profile" asChild>
                <Pressable style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </Pressable>
            </Link>
            <Link href="/profile" asChild>
                <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
            </Link>
        </View>
    );
}
