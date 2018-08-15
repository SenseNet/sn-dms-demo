import { createMuiTheme } from '@material-ui/core'

export const defaultCell: React.CSSProperties = {
    color: '#666',
    fontSize: '16px',
    fontFamily: 'Raleway Light',
    cursor: 'pointer',
}

export const selectedCell: React.CSSProperties = {
    color: '#016D9E',
    fontWeight: 'bold',
}

export const hoveredCell: React.CSSProperties = {
    color: 'black', fontWeight: 'bold',
}

export const contentListTheme = createMuiTheme({
    overrides: {
        MuiTableRow: {
            hover: {
                ...defaultCell,
                '&:hover': {... hoveredCell },
                '&.selected': {
                    color: '#016D9E !important',
                    fontWeight: 'bolder',
                },
            },
        },
        MuiTableCell: {
            body: {
                color: 'inherit',
                fontSize: '16px',
                fontWeight: 'inherit',
            },
            root: {
                '&.display-name,&.DisplayName': {
                    paddingLeft: 0,
                },
            },
        },
        MuiCheckbox: {
            checked: {
                color: '#016D9E !important',
            },
            root: {
                padding: 0,
                width: 'auto',
            },
        },
    },
})