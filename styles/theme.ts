import {
    moderateScale,
    scale,
} from 'react-native-size-matters';

export const dark = {
    borderRadius: {
        sm: scale(2),
        md: scale(4),
        lg: scale(8),
    },
    colors: {
        background: '#000000',
        primary: '#1E90FF',
        secondary: '#f5f5f5',
        text: '#FFFFFF',
        muted: '#888888',
        danger: '#FF6B6B',
        success: '#4CAF50',
        border: '#e0e0e0',
    },
    fontSizes: {
        xxs: moderateScale(4),
        xs: moderateScale(8),
        sm: moderateScale(12),
        md: moderateScale(16),
        lg: moderateScale(20),
        xl: moderateScale(24),
        xxl: moderateScale(32),
    },
    spacing: {
        xxs: scale(2),
        xs: scale(4),
        sm: scale(8),
        md: scale(16),
        lg: scale(24),
        xl: scale(32),
        xxl: scale(64),
    },

};

export const light = {
    borderRadius: {
        sm: scale(2),
        md: scale(4),
        lg: scale(8),
    },
    colors: {
        background: '#FFFFFF',
        primary: '#1E90FF',
        secondary: '#f5f5f5',
        text: '#333333',
        muted: '#888888',
        danger: '#FF6B6B',
        success: '#4CAF50',
        border: '#e0e0e0',
    },
    fontSizes: {
        xxs: moderateScale(4),
        xs: moderateScale(8),
        sm: moderateScale(12),
        md: moderateScale(16),
        lg: moderateScale(20),
        xl: moderateScale(24),
        xxl: moderateScale(32),
    },
    spacing: {
        xxs: scale(2),
        xs: scale(4),
        sm: scale(8),
        md: scale(16),
        lg: scale(24),
        xl: scale(32),
        xxl: scale(64),
    },

};

export const theme = light
export type Theme = typeof theme;
