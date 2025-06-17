import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown:false }} />
            <View style={styles.container}>
                <Text>Login</Text>
                <Link href={"/(tabs)"}>Iniciar</Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
