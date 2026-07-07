import { View, Text, Pressable } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';
import { useApiFetch } from '~/core/useApiFetch';

export function Profile() {
    const authentication = useAuthentication();
    if (!authentication) return <Redirect href="/profile/login" />;

    const { mutate, loading } = useApiFetch('user', 'UserController', 'getById', {id});

    const user = {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: false,
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
            <Link href="/profile/edit-profile" asChild>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </Pressable>
            </Link>
            <Link href="/profile/change-password" asChild>
                <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Change Password</Text>
                </Pressable>
            </Link>
        </View>
    );
}
