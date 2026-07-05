import { View, Text, Pressable } from 'react-native';
import { styles } from '~/user/styles';

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

    const ProfileField = ({ label, value }: { label: string; value: string }) => (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

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

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Change Password</Text>
            </Pressable>
        </View>
    );
}
