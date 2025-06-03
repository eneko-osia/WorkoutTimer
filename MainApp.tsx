// react imports
import React from 'react';
import {
    StatusBar,
    useColorScheme
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// project imports
import { RootStackParamList } from './navigation/types';
import HomeScreen from  './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';
import TimerScreen from './screens/TimerScreen';

// navigation
const Stack = createNativeStackNavigator<RootStackParamList>();

// application
export default function MainApp() {
    // hooks
    const scheme = useColorScheme();

    // jsx
    return (
        <>
            <StatusBar
                barStyle = { scheme === 'dark' ? 'light-content' : 'dark-content' }
                hidden = { false }
                translucent = { false }
                backgroundColor = 'transparent'
            />
            <NavigationContainer>
                <Stack.Navigator initialRouteName = 'Home'>
                    <Stack.Screen name = 'Home' component = { HomeScreen } />
                    <Stack.Screen name = 'Setup' component = { SetupScreen } />
                    <Stack.Screen name = 'Timer' component = { TimerScreen } />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
