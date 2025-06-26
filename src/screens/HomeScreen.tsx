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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import MaterialIcons from '@react-native-vector-icons/material-icons';

// project imports
import { deleteWorkout, loadWorkouts, saveWorkouts } from '../utils/storage';
import { formatDuration } from '../utils/format';
import { generateId } from '../utils/id';
import { RootStackParamList } from '../navigation/types';
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';
import { Workout } from '../types/workout';

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

    // attributes
    const [ workouts, setWorkouts ] = useState<Workout[]>([]);

    // effects
    useFocusEffect(
        useCallback(() => {
            loadAsync();
        }, [])
    );

    // methods
    const createWorkout = () => {
        const workout: Workout = new Workout({ id: generateId(), name: 'New Workout' });
        {
            const blockId: number = workout.createBlock();
            workout.createSubBlock(blockId, 'Prepare', 5);
        }
        {
            const blockId: number = workout.createBlock(3);
            workout.createSubBlock(blockId, 'Work', 10);
            workout.createSubBlock(blockId, 'Rest', 10);
        }
        {
            const blockId: number = workout.createBlock();
            workout.createSubBlock(blockId, 'Cooldown', 60);
        }
        return workout;
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

    const saveAsync = async (_workouts: Workout[]) => {
        await saveWorkouts(Workout.kStorageKey, _workouts);
    };

    // jsx
    return (
        <View style = { [ style.containerPrimary ] }>
            <View style = { [ style.containerSecondary, style.marginTop ] }>
                <View style = { [ style.row ] }>
                    <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                        Workouts
                    </Text>
                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline ] }
                        onPress = { () => { navigation.navigate('Settings'); } }
                    >
                        <MaterialIcons name = 'settings' size = { theme.sizes.sm }/>
                    </TouchableOpacity>
                </View>
                <View style = { [ style.row, style.marginTop ] }>
                    <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, style.border, style.outline, style.flex1 ] }
                        onPress = { () => { navigation.navigate('Setup', { workout: createWorkout(), pendingSave: true }); } }
                    >
                        <MaterialIcons name = 'add' size = { theme.sizes.sm }/>
                    </TouchableOpacity>
                </View>
            </View>
            {workouts.length === 0 ? (
                <></>
            ) : (
                <View style = { [ style.containerSecondary, style.marginVertical, style.flex1 ] }>
                    <DraggableFlatList
                        data = { workouts }
                        keyExtractor = { item => item.id.toString() }
                        onDragEnd = { ({ data }) => { setWorkouts(data); saveAsync(data); } }
                        scrollEnabled = { true }
                        renderItem = {({ item: workout, getIndex, drag, isActive }: RenderItemParams<Workout>) => (
                            <View style = { [ style.containerTertiary, (0 !== getIndex() ? style.marginTop : '') ] } key = { workout.id }>
                                <View style = { [ style.row ] }>
                                    <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                                        { workout.name } 
                                    </Text>
                                    <Text style = { [ style.text, style.normal, style.bold, style.right ] } numberOfLines = { 1 }>
                                        { formatDuration(workout.totalDuration) }
                                    </Text>
                                </View>
                                <View style = { [ style.row, style.marginTop ] }>
                                    <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, (workout.blocks.length === 0 ?  style.disabled : {}), style.border, style.outline, style.flex1 ] }
                                        disabled = { workout.blocks.length === 0 }
                                        onPress = { () => { navigation.navigate('Timer', { workout }); }}
                                    >
                                        <MaterialIcons name = 'play-arrow' size = { theme.sizes.sm }/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline ] }
                                        onPress = { () => { navigation.navigate('Setup', { workout: workout, pendingSave: false }); }}
                                    >
                                        <MaterialIcons name = 'edit' size = { theme.sizes.sm }/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline ] }
                                        onPress = { () => { removeWorkout(workout); } }
                                    >
                                        <MaterialIcons name = 'delete' size = { theme.sizes.sm }/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = { [ style.padding ] }
                                        disabled = { isActive }
                                        onPressOut = { drag }
                                    >
                                        <MaterialIcons name = 'reorder' size = { theme.sizes.sm }/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
}
