import lightBlue from '@material-ui/core/colors/lightBlue'
import pink from '@material-ui/core/colors/pink'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

import './css/raleway-font.css'

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#016D9E',
            dark: '#014a6b',
            contrastText: '#fff',
        },
        secondary: {
            light: '#016D9E',
            main: '#4caf50',
            dark: '#3d8b40',
            contrastText: '#fff',
        },
        error: {
            main: '#f44336',
        },
        text: {
            primary: '#666',
            secondary: '#666',
        },
    },
    typography: {
        // In Japanese the characters are usually larger.
        fontSize: 14,
        fontFamily: 'Raleway Regular',
    },
})

export default theme
