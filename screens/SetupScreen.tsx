// react imports
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

// project imports
import { RootStackParamList } from '../navigation/types';
import { saveWorkout } from '../utils/storage';
import { TimerBlock, Workout } from '../types/workout';
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';
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
    const [ , forceUpdate ] = useState(false);
    const { workout }       = route.params;

    // methods
    const createBlock = () => {
        createSubBlock(
            workout.addBlock({
                sets: 1,
                subBlocks: []
            })
        );
    };

    const createSubBlock = (blockId: number) => {
        workout.addSubBlock(blockId, {
            label: 'New Block',
            duration: 10
        });
        update();
    };

    const deleteBlock = (blockId: number) => {
        workout.deleteBlock(blockId)
        update();
    };

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
        await saveWorkout(Workout.kStorageKey, workout);
    };

    const update = () => {
        forceUpdate((prev) => !prev);
    }

    // jsx
    return (
        <View style = { [ style.primary, style.margin, style.padding, style.border, style.flex1 ] }>
            <View style = { [ style.secondary, style.marginVertical, style.marginHorizontal, style.padding, style.border, style.outlineThick ] }>
                <View style = { [ style.secondary, style.row ] }>
                    <TextInput style = { [ style.text, style.input, style.normal, style.left, style.padding, style.flex1  ] }
                        value = { workout.name }
                        maxLength = { 64 }
                        onChangeText = { (text) => { workout.name = text; update(); } }
                    />
                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, (workout.blocks.length === 0 ?  style.disabled : {}), style.border, style.outline ] }
                        disabled = { workout.blocks.length === 0 }
                        onPress = { () => { navigation.navigate('Timer', { workout }); }}
                    >
                        <MaterialIcons name = 'play-arrow' size = { theme.iconSize.sm }/>
                    </TouchableOpacity>
                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline ] }
                        onPress = { () => { saveAsync(); }}
                    >
                        <MaterialIcons name = 'save' size = { theme.iconSize.sm }/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, style.border, style.outline ] }
                    onPress = { () => createBlock() }
                >
                    <MaterialIcons name = 'add' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
            </View>
            {workout.blocks.length === 0 ? (
                <></>
            ) : (
                <View style = { [ style.secondary, style.margin, style.padding, style.border, style.outlineThick ] }>
                    <DraggableFlatList
                        data = { workout.blocks }
                        keyExtractor = { item => item.id.toString() }
                        onDragEnd = { ({ data }) => { workout.blocks = data; update(); } }
                        scrollEnabled = { true }
                        renderItem = {({ item: block, drag, isActive }: RenderItemParams<TimerBlock>) => (
                            <View style = { [ style.tertiary, style.marginVertical, style.padding, style.border, style.outlineThick, style.flex1 ] } key = { block.id }>
                                <TimerBlockEditor
                                    workout = { workout }
                                    block = { block }
                                    onChange = { update }
                                />
                                <View style = { [ style.tertiary, style.marginTop, style.row ] }>
                                    <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, (workout.blocks.length <= 1 ?  style.disabled : {}), style.border, style.outline, style.flex1 ] }
                                        disabled = { workout.blocks.length <= 1 }
                                        onPress = { () => { removeBlock(block.id); } }
                                    >
                                        <MaterialIcons name = 'delete' size = { theme.iconSize.sm }/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style = { [ style.marginTop, style.padding ] }
                                        disabled = { isActive }
                                        onPressOut = { drag }
                                    >
                                        <MaterialIcons name = 'reorder' size = { theme.iconSize.sm }/>
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
