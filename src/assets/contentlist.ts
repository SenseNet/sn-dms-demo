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
            head: {
                '& .Locked': {
                    'textAlign': 'center',
                    'margin': '0 auto',
                    '& span': {
                        display: 'inline-flex',
                    },
                    'padding': '0 12px',
                },
                'fontFamily': 'Raleway SemiBold',
                'fontSize': 14,
                'color': '#999',
            },
            hover: {
                ...defaultCell,
                '&:hover': { ...hoveredCell },
                '&.selected': {
                    color: '#016D9E !important',
                    fontWeight: 'bolder',
                },
                '&.type-folder .display-name .material-icons': {
                    color: '#016D9E',
                },
            },
        },
        MuiTableCell: {
            body: {
                color: 'inherit',
                fontSize: '16px',
                fontWeight: 'inherit',
                background: 'rgba(255,255,255,.8)',
            },
            root: {
                '&.display-name,&.DisplayName': {
                    paddingLeft: 0,
                    fontWeight: 'bold',
                },
                '&.display-name,&.DisplayName:contains(folder)': {
                    color: 'red',
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
