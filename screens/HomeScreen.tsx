// react imports
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// project imports
import { deleteWorkout, loadWorkouts } from '../utils/storage';
import { formatDuration } from '../utils/format';
import { generateId } from '../utils/id';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';
import { useStyles } from '../styles/common';
import { Workout } from '../types/workout';

// type definitions
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// screen
export default function HomeScreen() {
    // hooks
    const navigation = useNavigation<HomeScreenNavigationProp>();

    // attributes
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    // effects
    useFocusEffect(
        useCallback(() => {
            loadAsync();
        }, [])
    );

    // methods
    const createWorkout = () => {
        return new Workout({ id: generateId(), name: 'New Workout' });
    }

    const removeWorkout = (workout: Workout) => {
        if (Platform.OS === 'web') {
            deleteAsync(workout.id);
        }
        else {
            Alert.alert(
            'Delete Workout',
            `Are you sure you want to delete "${workout.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { deleteAsync(workout.id); } }
            ]);
        }
    }

    const deleteAsync = async (id: number) => {
        await deleteWorkout(Workout.kStorageKey, id);
        loadAsync();
    }

    const loadAsync = async () => {
        setWorkouts(await loadWorkouts(Workout.kStorageKey));
    };

    // jsx
    return (
        <View style = { [ style.primary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
            <View style = { [ style.secondary, style.marginTop, style.marginHorizontal, style.padding, style.border, style.outline ] }>
                <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, style.border, style.outline ] }
                    onPress = { () => { navigation.navigate('Setup', { workout: createWorkout() }); } }
                >
                    <MaterialIcons name = 'add' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
            </View>
            {workouts.length === 0 ? (
                <></>
            ) : (
                <View style = { [ style.secondary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
                    <Text style = { [ style.text, style.large, style.left ] } numberOfLines = { 1 }>
                        Workouts
                    </Text>
                    <ScrollView style = { [ style.secondary, style.paddingBottom ] }>
                    {workouts.map((workout) => (
                        <View style = { [ style.tertiary, style.marginTop, style.padding, style.border, style.outline ] } key = { workout.id }>
                            {/* <Text style = { [ style.text, style.normal ] }>
                                { workout.id }
                            </Text> */}
                            <View style = { [ style.tertiary, style.marginHorizontal, style.row ] }>
                                <Text style = { [ style.text, style.normal, style.left, style.flex1 ] } numberOfLines = { 1 }>
                                    { workout.name }
                                </Text>
                                <Text style = { [ style.text, style.normal, style.right ] } numberOfLines = { 1 }>
                                    { formatDuration(workout.totalDuration) }
                                </Text>
                            </View>
                            <View style = { [ style.tertiary, style.marginTop, style.row ] }>
                                <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, (workout.blocks.length === 0 ?  style.disabled : {}), style.border, style.outline, style.flex1 ] }
                                    disabled = { workout.blocks.length === 0 }
                                    onPress = { () => { navigation.navigate('Timer', { workout }); }}
                                >
                                    <MaterialIcons name = 'play-arrow' size = { theme.iconSize.sm }/>
                                </TouchableOpacity>
                                <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline ] }
                                    onPress = { () => { navigation.navigate('Setup', { workout }); }}
                                >
                                    <MaterialIcons name = 'edit' size = { theme.iconSize.sm }/>
                                </TouchableOpacity>
                                <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline ] }
                                    onPress = { () => { removeWorkout(workout); } }
                                >
                                    <MaterialIcons name = 'delete' size = { theme.iconSize.sm }/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

// styles
const style = StyleSheet.create({
    ...useStyles(theme),
})
