import Header from '@/components/layout/Header';
import { Text } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack screenOptions={{
          headerShown: false,
        }}>
          <View style={{flex:1,height:90, backgroundColor:"#000"}}>
            <Header title='fdsfs'/>
          </View>
          {/*<Stack.Screen name="login" options={{ headerShown: false }} />*/}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
})
