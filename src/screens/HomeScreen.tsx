// react imports
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Platform,
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
import { deleteWorkout, loadSettings, loadWorkouts, saveWorkouts } from '../utils/storage';
import { formatDuration } from '../utils/format';
import { generateId } from '../utils/id';
import { RootStackParamList } from '../navigation/types';
import { Settings } from '../types/settings'
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';
import { Workout } from '../types/workout';

// type definitions
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// screen
export default function HomeScreen() {
    // hooks
    const navigation    = useNavigation<HomeScreenNavigationProp>();
    const scheme        = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = useStyles(theme);

    // attributes
    const [ settings, setSettings ] = useState<Settings | null>(null);
    const [ workouts, setWorkouts ] = useState<Workout[]>([]);

    // methods
    const createWorkout = useCallback(() => {
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
    }, []);

    const loadSettingsAsync = useCallback(async () => {
        setSettings(await loadSettings(Settings.kStorageKey));
    }, []);

    const loadWorkoutsAsync = useCallback(async () => {
        setWorkouts(await loadWorkouts(Workout.kStorageKey));
    }, []);

    const saveWorkoutAsync = useCallback(async (_workouts: Workout[]) => {
        await saveWorkouts(Workout.kStorageKey, _workouts);
    }, []);

    const deleteWorkoutAsync = useCallback(async (id: number) => {
        await deleteWorkout(Workout.kStorageKey, id);
        loadWorkoutsAsync();
    }, [ loadWorkoutsAsync ]);

    const removeWorkout = useCallback((workout: Workout) => {
        if (Platform.OS === 'web') {
            deleteWorkoutAsync(workout.id);
        }
        else {
            Alert.alert(
            'Delete Workout',
            `Are you sure you want to delete "${workout.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { deleteWorkoutAsync(workout.id); } }
            ]);
        }
    }, [ deleteWorkoutAsync ]);

    // effects
    useFocusEffect(() => {
        loadSettingsAsync();
        loadWorkoutsAsync();
    });

    useEffect(() => {
        if (settings) {
            theme.colors = settings.getColors(scheme);
        }
    }, [ scheme, settings, theme ]);

    // jsx
    const renderItem = ({ item: workout, getIndex, drag, isActive }: RenderItemParams<Workout>) => (
        <View style = { [ style.containerTertiary, (getIndex() !== 0 ? style.marginTop : '') ] } key = { workout.id }>
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
    );

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
            {workouts.length > 0 && (
                <View style = { [ style.containerSecondary, style.marginVertical, style.flex1 ] }>
                    <DraggableFlatList
                        data            = { workouts }
                        keyExtractor    = { item => item.id.toString() }
                        onDragEnd       = { ({ data }) => { setWorkouts(data); saveWorkoutAsync(data); } }
                        scrollEnabled   = { true }
                        renderItem      = { renderItem }
                    />
                </View>
            )}
        </View>
    );
}
