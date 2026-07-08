import { View, Text, Pressable } from 'react-native';
import { styles } from '~/user/styles';
import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';
import { useApiFetch } from '~/core/useApiFetch';

type RouteParams = {
    id: string;
};

export function Profile() {
    const authentication = useAuthentication();
    if (!authentication) return <Redirect href="/profile/login" />;
    const { id } = useLocalSearchParams<RouteParams>();

    const { data, loading } = useApiFetch('user', 'UserController', 'getById', {
        id: parseInt(id),
    });
    if (loading || !data) return null;

    const ProfileField = ({ label, value }: { label: string; value: string }) => (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            <ProfileField label="First Name" value={data.firstName} />
            <ProfileField label="Last Name" value={data.lastName} />
            <ProfileField label="Username" value={data.userName} />
            <ProfileField label="Email Address" value={data.email} />
            <ProfileField label="Status" value={data.isActive ? 'Active' : 'Inactive'} />
            <ProfileField
                label="Member Since"
                value={new Date(data.createdAt).toLocaleDateString()}
            />
            <ProfileField
                label="Last Login"
                value={data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString() : 'Never'}
            />
            <Link href={`/profile/${id}/edit-profile`} asChild>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </Pressable>
            </Link>
            <Link href={`/profile/${id}/change-password`} asChild>
                <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Change Password</Text>
                </Pressable>
            </Link>
        </View>
    );
}
