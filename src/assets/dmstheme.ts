import { createMuiTheme } from '@material-ui/core'
import theme from './theme'

export const dmsTheme = createMuiTheme({
    ...theme,
    overrides: {
        MuiTypography: {
            headline: {
                [theme.breakpoints.down('md')]: {
                    fontSize: 14,
                },
            },
            gutterBottom: {
                marginBottom: 10,
            },
        },
        MuiGrid: {
            'spacing-xs-16': {
                marginBottom: 0,
            },
        },
        MuiListItemText: {
            primary: {
                [theme.breakpoints.down('md')]: {
                    fontSize: 12,
                    fontFamily: 'Raleway SemiBold',
                    opacity: .54,
                },
            },
            secondary: {
                [theme.breakpoints.down('md')]: {
                    fontSize: 13,
                    fontFamily: 'Raleway Medium',
                },
            },
        },
    },
})
