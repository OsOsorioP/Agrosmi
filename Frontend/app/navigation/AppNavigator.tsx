import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import TabNavigator from './TabNavigator';
import { RootStackParamList } from './types';
import Header from '../components/Header/Header';

const RootStack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
        <Header />
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={TabNavigator} />
        </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;