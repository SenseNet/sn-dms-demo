import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

import './css/raleway-font.css'

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#509bcf',
            main: '#016d9e',
            dark: '#00426f',
            contrastText: '#fff',
        },
        secondary: {
            light: '#80e27e',
            main: '#4caf50',
            dark: '#087f23',
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
        fontSize: 16,
        fontFamily: 'Raleway Regular',
    },
})

export default theme
