import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import ChatScreen from '../screens/ChatScreen';
import WeatherScreen from '../screens/WeatherScreen';
import PlotsScreen from '../screens/PlotsScreen';
import { RootTabParamList } from './types';
import { SafeAreaView } from 'react-native';
import ChatHistoryListScreen from '../screens/ChatHistoryListScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabNavigator() {
  return (
    <SafeAreaView>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Chat') {
              iconName = focused ? 'message-circle' : 'message-circle';
            } else if (route.name === 'Clima') {
              iconName = focused ? 'cloud' : 'cloud';
            } else if (route.name === 'Parcelas') {
              iconName = focused ? 'map' : 'map';
            } else if (route.name === 'Chats') {
              iconName = focused ? 'archive' : 'archive';
            } else {
              iconName = 'circle';
            }

            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#242424',
            borderTopColor: '#333',
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        })}
      >
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Clima" component={WeatherScreen} />
        <Tab.Screen name="Parcelas" component={PlotsScreen} />
        <Tab.Screen name="Chats" component={ChatHistoryListScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default TabNavigator;