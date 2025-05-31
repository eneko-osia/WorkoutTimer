import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

import { Theme } from './theme';

export const useStyles = (theme: Theme) => StyleSheet.create({
    // container
    container: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        borderWidth: scale(1),
        margin: theme.spacing.xs,
        padding: theme.spacing.xs,
    },

    rowContainer: {
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        borderWidth: scale(1),
        flexDirection: 'row',
        justifyContent: 'center',
        margin: theme.spacing.xs,
        padding: theme.spacing.xs,
    },

    subBlockContainer: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        borderWidth: scale(1),
        margin: theme.spacing.xs,
        padding: theme.spacing.xs,
    },

    // button
    button: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        borderWidth: scale(1),
        marginBottom: theme.spacing.xs,
        marginTop: theme.spacing.xs,
        padding: theme.spacing.xs,
    },

    buttonDisabled: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        borderWidth: scale(1),
        marginBottom: theme.spacing.xs,
        marginTop: theme.spacing.xs,
        opacity: 0.5,
        padding: theme.spacing.xs,
    },

    // text
    buttonText: {
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        borderWidth: scale(1),
        color: theme.colors.text,
        fontSize: theme.fontSizes.md,
        fontWeight: 'bold',
    },

    titleText: {
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        borderWidth: scale(1),
        color: theme.colors.text,
        fontSize: theme.fontSizes.lg,
        fontWeight: 'bold',
    },
});
