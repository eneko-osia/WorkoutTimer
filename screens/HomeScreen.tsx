import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';
import { useStyles } from '../styles/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    return (
        <View style = {style.container}>
            <Text style = {style.titleText}>Workouts</Text>
            <TouchableOpacity style = {style.button} onPress = {() => navigation.navigate('Setup')} >
                <Text style = {style.buttonText}>Create Workout</Text>
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    ...useStyles(theme)
})
