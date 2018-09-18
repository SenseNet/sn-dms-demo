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
    },
})
