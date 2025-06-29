// react imports
import React, { useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import MaterialIcons from '@react-native-vector-icons/material-icons';

// project imports
import { RootStackParamList } from '../navigation/types';
import { saveWorkout } from '../utils/storage';
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';
import { Workout } from '../types/workout';
import TimerBlockEditor from '../components/TimerBlockEditor';

// type definitions
type SetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;
type SetupScreenRouteProp = RouteProp<RootStackParamList, 'Setup'>;

// screen
export default function SetupScreen() {
    // hooks
    const navigation = useNavigation<SetupScreenNavigationProp>();
    const route = useRoute<SetupScreenRouteProp>();
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ ...useStyles(theme) })

    // attributes
    const { workout, pendingSave }              = route.params;
    const [ , forceUpdate ]                     = useState(false);
    const [ pendingChanges, setPendingChanges ] = useState(pendingSave);
    const flatList                              = useRef<FlatList>(null);

    // methods
    const createBlock = () => {
        {
            const blockId: number = workout.createBlock();
            workout.createSubBlock(blockId, 'New Block');
        }
        update();
        flatList.current?.scrollToEnd({ animated: true });
    };

    const deleteBlock = (blockId: number) => {
        workout.deleteBlock(blockId)
        update();
    };

    const moveBlock = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) { return; }
        const [ item ] = workout.blocks.splice(fromIndex, 1);
        workout.blocks.splice(toIndex, 0, item);
        update();
    }

    const removeBlock = (blockId: number) => {
        if (Platform.OS === 'web') {
            deleteBlock(blockId);
        }
        else {
            Alert.alert(
            'Delete Timer Block',
            'Are you sure you want to delete timer block?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { deleteBlock(blockId); } }
            ]);
        }
    }

    const saveAsync = async () => {
        setPendingChanges(false);
        await saveWorkout(Workout.kStorageKey, workout);
    };

    const update = () => {
        setPendingChanges(true);
        forceUpdate((_prev) => !_prev);
    }

    // jsx
    return (
        <View style = { [ style.containerPrimary ] }>
            <View style = { [ style.containerSecondary, style.marginTop ] }>
                <View style = { [ style.row ] }>
                    <TextInput style = { [ style.text, style.normal, style.input, style.left, style.padding, style.border, style.outline, style.flex1 ] }
                        value = { workout.name }
                        maxLength = { 64 }
                        onChangeText = { (text) => { workout.name = text; update(); } }
                    />
                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, (workout.blocks.length === 0 ?  style.disabled : {}), style.border, style.outline ] }
                        disabled = { workout.blocks.length === 0 }
                        onPress = { () => { navigation.navigate('Timer', { workout }); }}
                    >
                        <MaterialIcons name = 'play-arrow' size = { theme.sizes.sm }/>
                    </TouchableOpacity>
                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, (!pendingChanges ?  style.disabled : {}), style.border, style.outline ] }
                        disabled = { !pendingChanges }
                        onPress = { () => { saveAsync(); }}
                    >
                        <MaterialIcons name = 'save' size = { theme.sizes.sm }/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, style.border, style.outline ] }
                    onPress = { () => createBlock() }
                >
                    <MaterialIcons name = 'add' size = { theme.sizes.sm }/>
                </TouchableOpacity>
            </View>
            {workout.blocks.length === 0 ? (
                <></>
            ) : (
                <View style = { [ style.containerSecondary, style.marginVertical, style.flex1 ] }>
                    <Animated.FlatList
                        data = { workout.blocks }
                        ref = { flatList }
                        keyExtractor = { (item) => item.id.toString() }
                        itemLayoutAnimation = { LinearTransition }
                        renderItem = {({ item, index }) => (
                            <View style = { [ style.containerTertiary, (index !== 0 ? style.marginTop : '') ] } key = { item.id }>
                                <TimerBlockEditor
                                    workout = { workout }
                                    block = { item }
                                    onChange = { update }
                                />
                                <View style = { [ style.row, style.marginTop ] }>
                                    <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, (index === 0 ?  style.disabled : {}), style.border, style.outline ] }
                                        disabled = { index === 0 }
                                        onPress = { () => { moveBlock(index, Math.max(0, index - 1)); } }
                                    >
                                        <MaterialIcons name = 'arrow-upward' size = { theme.sizes.sm }/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.marginTop, style.padding, style.button, (workout.blocks.length <= 1 ?  style.disabled : {}), style.border, style.outline, style.flex1 ] }
                                        disabled = { workout.blocks.length <= 1 }
                                        onPress = { () => { removeBlock(item.id); } }
                                    >
                                        <MaterialIcons name = 'delete' size = { theme.sizes.sm }/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.marginTop, style.padding, (index === (workout.blocks.length - 1) ?  style.disabled : {}), style.button, style.border, style.outline ] }
                                        disabled = { index === (workout.blocks.length - 1) }
                                        onPress = { () => { moveBlock(index, Math.min((workout.blocks.length - 1), index + 1)); } }
                                    >
                                        <MaterialIcons name = 'arrow-downward' size = { theme.sizes.sm }/>
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
