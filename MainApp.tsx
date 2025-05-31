import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './navigation/types';
import HomeScreen from  './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';
import TimerScreen from './screens/TimerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainApp() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = 'Home'>
                <Stack.Screen name = 'Home' component = { HomeScreen } />
                <Stack.Screen name = 'Setup' component = { SetupScreen } />
                <Stack.Screen name = 'Timer' component = { TimerScreen } />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
