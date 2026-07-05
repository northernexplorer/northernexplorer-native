import { View, Text, Pressable, StyleSheet } from 'react-native';

export function Profile() {
    const user = {
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe123',
        email: 'john.doe@example.com',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

            <View style={styles.section}>
                <ProfileField label="First Name" value={user.firstName} />

                <ProfileField label="Last Name" value={user.lastName} />

                <ProfileField label="Username" value={user.userName} />

                <ProfileField label="Email Address" value={user.email} />

                <ProfileField label="Status" value={user.isActive ? 'Active' : 'Inactive'} />

                <ProfileField label="Member Since" value={user.createdAt.toLocaleDateString()} />

                <ProfileField
                    label="Last Login"
                    value={user.lastLoginAt ? user.lastLoginAt.toLocaleString() : 'Never'}
                />
            </View>

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Change Password</Text>
            </Pressable>
        </View>
    );
}

interface ProfileFieldProps {
    label: string;
    value: string;
}

function ProfileField({ label, value }: ProfileFieldProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        padding: 24,
        gap: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
    },
    section: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        overflow: 'hidden',
    },
    field: {
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
    },
    label: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    value: {
        fontSize: 17,
        fontWeight: '500',
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
