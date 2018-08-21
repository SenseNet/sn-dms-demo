import { createMuiTheme } from '@material-ui/core'
import { theme } from './theme'

export const pickerTheme = createMuiTheme({
    ...theme,
    overrides: {
        MuiPopover: {
            paper: {
                padding: 0,
            },
        },
        MuiDialogTitle: {
            root: {
                padding: 0,
            },
        },
        MuiToolbar: {
            root: {
                background: '#666',
                color: '#fff',
            },
            regular: {
                padding: 0,
                minHeight: '50px !important',
            },
        },
        MuiTypography: {
            root: {
                '&.selected, &.active, &:hover, &.active:hover': {
                    color: '#fff !important',
                },
            },
            title: {
                fontFamily: 'Raleway Semibold',
                fontSize: 18,
                flex: 1,
            },
            subheading: {
                'fontFamily': 'Raleway Medium',
                'fontSize': 15,
                '&.selected, &.active': {
                    color: '#fff',
                },
            },
            body1: {
                '&.picker-item-selected': {
                    color: '#fff',
                },
            },
        },
        MuiDialogContent: {
            root: {
                padding: 0,
            },
        },
        MuiList: {
            root: {
                'padding': '0px !important',
                '&:hover': {
                    color: '#fff !important',
                },
            },
        },
        MuiListItem: {
            root: {
                '&:hover': {
                    'backgroundColor': '#016D9E !important',
                    '& path': {
                        fill: '#fff',
                    },
                    '& span': {
                        color: '#fff',
                    },
                },
                'borderBottom': 'solid 1px #ddd',
            },
            gutters: {
                padding: '12px !important',
            },
        },
        MuiListItemText: {
            root: {
                padding: 0,
                color: '#b0b0b0',
            },
        },
        MuiListItemIcon: {
            root: {
                color: '#b0b0b0',
                marginRight: 10,
            },
        },
        MuiDialogActions: {
            root: {
                margin: '6px 10px 6px 0px',
            },
            action: {
                margin: 0,
            },
        },
    },
})
