// react imports
import { Colors } from '../types/colors'
import { ColorSchemeName } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { moderateScale, scale } from 'react-native-size-matters';

// themes
const common = {
    borderRadius: {
        sm:     scale(2),
        md:     scale(4),
        lg:     scale(8),
    },
    fontSizes: {
        xxs:    moderateScale(4),
        xs:     moderateScale(8),
        sm:     moderateScale(12),
        md:     moderateScale(16),
        lg:     moderateScale(32),
        xl:     moderateScale(64),
        xxl:    moderateScale(96),
    },
    sizes: {
        xs:     scale(8),
        sm:     scale(16),
        md:     scale(32),
        lg:     scale(64),
        xl:     scale(128),
    },
    spacing: {
        xxs:    scale(2),
        xs:     scale(4),
        sm:     scale(8),
        md:     scale(16),
        lg:     scale(24),
        xl:     scale(32),
        xxl:    scale(64),
    },
};

const dark = {
    ...common,
    dark: DarkTheme.dark,
    colors: new Colors({
        background:     'rgb(1, 1, 1)',
        card:           'rgb(18, 18, 18)',
        notification:   'rgb(255, 69, 58)',
        primary:        'rgb(30, 32, 30)',
        secondary:      'rgb(60, 61, 55)',
        tertiary:       'rgb(105, 117, 101)',
        quaternary:     'rgb(236, 223, 204)',
        text:           'rgb(229, 229, 231)',
        input:          'rgb(18, 18, 18)',
        border:         'rgb(39, 39, 41)'
    }),
    fonts : { ...DarkTheme.fonts },
};

const light = {
    ...common,
    dark: DefaultTheme.dark,
    colors: new Colors({
        background:     'rgb(242, 242, 242)',
        card:           'rgb(255, 255, 255)',
        notification:   'rgb(255, 59, 48)',
        primary:        'rgb(90, 130, 126)',
        secondary:      'rgb(132, 174, 146)',
        tertiary:       'rgb(185, 212, 170)',
        quaternary:     'rgb(250, 255, 202)',
        text:           'rgb(28, 28, 30)',
        input:          'rgb(255, 255, 255)',
        border:         'rgb(216, 216, 216)'
    }),
    fonts : { ...DefaultTheme.fonts },
};

const _dark = {
    ...dark,
    colors: new Colors({ ...dark.colors }),
};

const _light = {
    ...light,
    colors: new Colors({ ...light.colors }),
};

export type Theme = typeof dark;
export const useDarkTheme = (): Theme => {
    return dark;
};
export const useLightTheme = (): Theme => {
    return light;
};
export const useDefaultTheme = (scheme: ColorSchemeName): Theme => {
    return (scheme === 'dark' ? dark : light);
};
export const useTheme = (scheme: ColorSchemeName): Theme => {
    return (scheme === 'dark' ? _dark : _light);
}
