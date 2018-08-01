import { InputAdornment, WithStyles, withStyles } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'
import * as React from 'react'

const styles = (theme) => ({
    wsSearchContainer: {
        display: 'flex',
        flexGrow: 1,
        background: '#fff',
        borderRadius: 3,
        boxShadow: '#015176 0px 2px 2px',
    },
    wsSearchInput: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.common.white,
        border: '0',
        fontSize: 16,
        padding: '10px 12px',
        width: '100%',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: 'Raleway Medium',
    },
    formControl: {
        width: '100%',
    },
    icon: {
        color: '#7b7b7b',
    },
    startAdornment: {
        margin: '4px 0 4px 5px',
    },
    searchContainer: {
        padding: '0px 10px 10px 10px',
    },
})

type C = 'wsSearchInput'

class WorkspaceSearch extends React.Component<{ classes, handleKeyup: (e) => void } & WithStyles<C>, {}> {
    constructor(props) {
        super(props)
        this.handleKeyup = this.handleKeyup.bind(this)
    }
    public handleKeyup = (e) => {
        this.props.handleKeyup(e.target.value)
    }
    public render() {
        const { classes } = this.props
        return (
            <div className={classes.searchContainer}>
                <FormControl className={classes.formControl}>
                    <TextField
                        onKeyUp={(e) => this.handleKeyup(e)}
                        placeholder="Search"
                        InputProps={{
                            disableUnderline: true,
                            classes: {
                                input: classes.wsSearchInput,
                                root: classes.wsSearchContainer,
                            },
                            startAdornment: <InputAdornment position="start" className={classes.startAdornment}>
                                <SearchIcon className={classes.icon} />
                            </InputAdornment>,
                        }}
                    />
                </FormControl>
            </div>
        )
    }
}

export default withStyles(styles as any)(WorkspaceSearch)
