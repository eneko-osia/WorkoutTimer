// react imports
import React from 'react';
import {
    StatusBar,
    StyleSheet,
    useColorScheme,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

// project imports
import { RootStackParamList } from './navigation/types';
import { useStyles } from './styles/common';
import { useTheme } from './styles/theme';
import HomeScreen from  './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';
import TimerScreen from './screens/TimerScreen';

// navigation
const Stack = createNativeStackNavigator<RootStackParamList>();

// application
export default function MainApp() {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ ...useStyles(theme) })

    // jsx
    return (
        <>
            <StatusBar
                barStyle = { (scheme === 'dark' ? 'light-content' : 'dark-content') }
                hidden = { false }
                translucent = { false }
                backgroundColor = 'transparent'
            />
             <GestureHandlerRootView style = { style.flex1 } >
                <NavigationContainer theme = { theme } >
                    <Stack.Navigator initialRouteName = 'Home'>
                        <Stack.Screen name = 'Home' component = { HomeScreen } />
                        <Stack.Screen name = 'Setup' component = { SetupScreen } />
                        <Stack.Screen name = 'Timer' component = { TimerScreen } />
                    </Stack.Navigator>
                </NavigationContainer>
            </GestureHandlerRootView>
        </>
    );
}
