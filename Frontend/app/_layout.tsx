import Header from '@/components/layout/Header';
import { Text } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <View>
        <Text>fgdfgdfg</Text>
      </View>
      {/*<Stack.Screen name="login" options={{ headerShown: false }} />*/}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  
})
