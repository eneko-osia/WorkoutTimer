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

        outlineThick: {
            borderWidth: scale(2),
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
        containerPrimary: {
            backgroundColor: theme.colors.primary,
            flex: 1,
        },
        containerSecondary: {
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            borderWidth: scale(2),
            padding: theme.spacing.xs,
        },
        containerTertiary : {
            backgroundColor: theme.colors.tertiary,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            borderWidth: scale(2),
            padding: theme.spacing.xs,
        },
        preview: {
            width: '100%',
            height: '100%',
        },
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

        // line
        line: {
            alignSelf: 'stretch',
            backgroundColor: theme.colors.primary,
            height: '100%',
            width: scale(1),
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
        input: {
            backgroundColor: theme.colors.input,
        },
        bold: {
            fontWeight: 'bold',
        },
        normal: {
            fontSize: theme.fontSizes.md,
        },
        xxsmall: {
            fontSize: theme.fontSizes.xxs,
        },
        xsmall: {
            fontSize: theme.fontSizes.xs,
        },
        small: {
            fontSize: theme.fontSizes.sm,
        },
        large: {
            fontSize: theme.fontSizes.lg,
        },
        xlarge: {
            fontSize: theme.fontSizes.xl,
        },
        xxlarge: {
            fontSize: theme.fontSizes.xxl,
        },
    });
}
