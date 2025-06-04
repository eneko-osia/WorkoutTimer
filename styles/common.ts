import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

import { Theme } from './theme';

export const useStyles = (theme: Theme) => {
    return StyleSheet.create({
        // alignment
        center: {
            textAlign: 'center',
        },
        left: {
            textAlign: 'left',
        },
        right: {
            textAlign: 'right',
        },

        // borders
        border: {
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
        },

        outline: {
            borderWidth: scale(1),
        },

        // buttons
        button: {
            alignItems: 'center',
        },

        disabled: {
            opacity: 0.5,
        },

        // colors
        primary: {
            backgroundColor: theme.colors.primary,
        },
        secondary: {
            backgroundColor: theme.colors.secondary,
        },
        tertiary: {
            backgroundColor: theme.colors.tertiary,
        },
        quaternary: {
            backgroundColor: theme.colors.quaternary,
        },

        // containers
        row: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },

        // flex
        flex1: {
            flex: 1,
        },
        flex2: {
            flex: 2,
        },
        flex3: {
            flex: 3,
        },
        flex4: {
            flex: 4,
        },

        // spacing
        margin: {
            margin: theme.spacing.xs,
        },
        marginHorizontal: {
            marginHorizontal: theme.spacing.xs,
        },
        marginVertical: {
            marginVertical: theme.spacing.xs,
        },
        marginBottom: {
            marginBottom: theme.spacing.xs,
        },
        marginTop: {
            marginTop: theme.spacing.xs,
        },
        marginLeft: {
            marginLeft: theme.spacing.xs,
        },
        marginRight: {
            marginRight: theme.spacing.xs,
        },
        padding: {
            padding: theme.spacing.xs,
        },
        paddingHorizontal: {
            paddingHorizontal: theme.spacing.xs,
        },
        paddingVertical: {
            paddingVertical: theme.spacing.xs,
        },
        paddingBottom: {
            paddingBottom: theme.spacing.xs,
        },
        paddingTop: {
            paddingTop: theme.spacing.xs,
        },
        paddingLeft: {
            marginLeft: theme.spacing.xs,
        },
        paddingRight: {
            marginRight: theme.spacing.xs,
        },

        // text
        text: {
            color: theme.colors.text,
        },
        normal: {
            fontSize: theme.fontSizes.md,
            fontWeight: 'bold',
        },
        xxsmall: {
            fontSize: theme.fontSizes.xxs,
            fontWeight: 'bold',
        },
        xsmall: {
            fontSize: theme.fontSizes.xs,
            fontWeight: 'bold',
        },
        small: {
            fontSize: theme.fontSizes.sm,
            fontWeight: 'bold',
        },
        large: {
            fontSize: theme.fontSizes.lg,
            fontWeight: 'bold',
        },
        xlarge: {
            fontSize: theme.fontSizes.xl,
            fontWeight: 'bold',
        },
        xxlarge: {
            fontSize: theme.fontSizes.xxl,
            fontWeight: 'bold',
        },
    });
}
