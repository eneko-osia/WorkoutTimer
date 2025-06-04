// react imports
import React, { useState } from 'react';
import {
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

    const saveAsync = async () => {
        await saveWorkout(Workout.kStorageKey, workout);
    };

    const update = () => {
        forceUpdate((prev) => !prev);
    }

    // jsx
    return (
        <View style = { [ style.primary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
            <View style = { [ style.secondary, style.marginTop, style.marginHorizontal, style.padding, style.border, style.outline ] }>
                <View style = { [ style.secondary, style.row ] }>
                    <TextInput style = { [ style.text, style.input, style.normal, style.left, style.marginRight, style.padding, style.flex1  ] }
                        value = { workout.name }
                        maxLength = { 64 }
                        onChangeText = { (text) => { workout.name = text; update(); } }
                    />
                    <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, style.border, style.outline ] }
                        onPress = { () => { saveAsync(); }}
                    >
                        <MaterialIcons name = 'save' size = { theme.iconSize.sm }/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, (workout.blocks.length === 0 ?  style.disabled : {}), style.border, style.outline ] }
                    disabled = { workout.blocks.length === 0 }
                    onPress = { () => { navigation.navigate('Timer', { workout }); }}
                >
                    <MaterialIcons name = 'play-arrow' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
                <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, style.border, style.outline ] }
                    onPress = { () => createBlock() }
                >
                    <MaterialIcons name = 'add-circle' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
            </View>
            {workout.blocks.length === 0 ? (
                <></>
            ) : (
                <View style = { [ style.secondary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
                    <DraggableFlatList
                        data = { workout.blocks }
                        keyExtractor = { item => item.id.toString() }
                        onDragEnd = { ({ data }) => { workout.blocks = data; update(); } }
                        scrollEnabled = { true }
                        renderItem = {({ item: block, drag, isActive }: RenderItemParams<TimerBlock>) => (
                            <TouchableOpacity onLongPress = { drag } disabled = { isActive }>
                                <TimerBlockEditor
                                    workout = { workout }
                                    block = { block }
                                    onChange = { update }
                                />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}
