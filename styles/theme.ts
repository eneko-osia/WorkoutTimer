// react imports
import { ColorSchemeName } from 'react-native';
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
    iconSize: {
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
    colors: {
        primary:    '#5A827E',
        secondary:  '#84AE92',
        tertiary:   '#B9D4AA',
        quaternary: '#FAFFCA',
        border:     '#E0E0E0',
        text:       '#333333',
        input:      '#FFFFFF',
    },
};

export const light = {
    ...common,
    colors: {
        primary:    '#5A827E',
        secondary:  '#84AE92',
        tertiary:   '#B9D4AA',
        quaternary: '#FAFFCA',
        border:     '#E0E0E0',
        text:       '#333333',
        input:      '#FFFFFF',
    },
};

export type Theme = typeof light;
export const useTheme = (scheme: ColorSchemeName) => {
    return (scheme === 'dark' ? dark : light);
}
