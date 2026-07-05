import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export function EditProfile() {
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
        // TODO: Call update profile API
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

            <Pressable style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
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
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#2563eb',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#2563eb',
        fontSize: 16,
        fontWeight: '600',
    },
});
