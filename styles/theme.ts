// react imports
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
        xxl:    moderateScale(128),
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

export const dark = {
    ...common,
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary:    'rgb(30, 32, 30)',
        secondary:  'rgb(60, 61, 55)',
        tertiary:   'rgb(105, 117, 101)',
        quaternary: 'rgb(236, 223, 204)',
        input:      'rgb(18, 18, 18)',
    },
};

export const light = {
    ...common,
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary:    'rgb(90, 130, 126)',
        secondary:  'rgb(132, 174, 146)',
        tertiary:   'rgb(185, 212, 170)',
        quaternary: 'rgb(250, 255, 202)',
        input:      'rgb(255, 255, 255)',
    },
};

export type Theme = typeof light;
export const useTheme = (scheme: ColorSchemeName) => {
    return (scheme === 'dark' ? dark : light);
}
