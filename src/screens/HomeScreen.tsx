// react imports
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

// project imports
// import { deleteWorkout, loadWorkouts, saveWorkouts } from '../utils/storage';
// import { formatDuration } from '../utils/format';
// import { generateId } from '../utils/id';
import { RootStackParamList } from '../navigation/types';
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';
// import { Workout } from '../types/workout';

// type definitions
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// screen
export default function HomeScreen() {
    // hooks
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ ...useStyles(theme) })

    // jsx
    return (
        <View style = { [ style.containerPrimary ] }>
            <View style = { [ style.containerSecondary ] }>
                <Text style = { [ style.text, style.large, style.bold, style.left ] } numberOfLines = { 1 }>
                    Workouts
                </Text>
                <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, style.border, style.outline ] }>
                    {/* <MaterialIcons name = 'add' size = { theme.sizes.sm }/> */}
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
