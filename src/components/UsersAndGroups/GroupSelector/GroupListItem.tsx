import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import withStyles from '@material-ui/core/styles/withStyles'
import { Group } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '../../..'
import { deselectGroup, selectGroup } from '../../../store/usersandgroups/actions'

const styles = {
    listItem: {
        listStyleType: 'none',
        borderTop: 'solid 1px #2080aa',
        padding: '12px 12px 12px 0px',
    },
    listItemRoot: {
        padding: 0,
    },
    primary: {
        'fontFamily': 'Raleway ExtraBold',
        'fontSize': 15,
        'lineHeight': '24px',
        'color': '#fff',
        'background': 'none',
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    secondary: {
        color: '#fff',
        fontFamily: 'Raleway SemiBold',
        fontStyle: 'italic',
        fontSize: 11,
    },
    icon: {
        margin: 0,
        color: '#fff',
    },
    iconButton: {
        'margin': 0,
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    followedIconButton: {
        margin: 0,
        padding: 0,
        color: '#ffeb3b',
    },
}

interface GroupListItemProps extends RouteComponentProps<any> {
    selected: boolean,
    group: Group | null,
    userName: string,
    closeDropDown: (open: boolean) => void,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        userName: state.sensenet.session.user.userName,
        options: state.sensenet.currentitems.options,
    }
}

const mapDispatchToProps = {
    selectGroup,
    deselectGroup,
    loadContent: Actions.loadContent,
    fetchContent: Actions.requestContent,
}

interface GroupListItemState {
    selected: boolean,
}

class GroupListItem extends React.Component<{ classes: any } & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & GroupListItemProps, GroupListItemState> {
    public state = {
        selected: this.props.selected,
    }
    constructor(props: GroupListItem['props']) {
        super(props)

        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }
    public handleClick = (path: string) => {
        const doclibPath = `${path}/Document_Library`
        const newPath = compile(this.props.match.path)({ folderPath: btoa(doclibPath) })
        this.props.history.push(newPath)
        this.props.closeDropDown(true)
    }
    public checkboxClick = (group: Group | null) => {
        this.state.selected ? this.props.deselectGroup(group ? group.Id : 0) : this.props.selectGroup(group ? [group] : [])
        this.setState({
            selected: !this.state.selected,
        })
    }
    public handleMouseOver = (e: any) => e.currentTarget.style.backgroundColor = '#01A1EA'
    public handleMouseLeave = (e: any) => e.currentTarget.style.backgroundColor = 'transparent'
    public shortenPath = (path: string) => path.replace('/Root/IMS/', '')
    public render() {
        const { classes, group, selected } = this.props
        return (
            <MenuItem
                onMouseOver={(e) => this.handleMouseOver(e)}
                onMouseLeave={(e) => this.handleMouseLeave(e)}
                style={styles.listItem}>
                <ListItemIcon className={classes.icon}>
                    <IconButton
                        className={selected ? classes.followedIconButton : classes.iconButton}>
                        <Icon
                            className={selected ? classes.followedIconButton : classes.iconButton}
                            type={iconType.materialui}
                            iconName={selected ? 'check_box' : 'check_box_outline_blank'}
                            style={selected ? { color: '#ffeb3b', margin: '0 10px' } : { color: '#fff', margin: '0 10px' }}
                            onClick={() => this.checkboxClick(group)} />
                    </IconButton>
                </ListItemIcon>
                <ListItemText
                    classes={{ primary: classes.primary, root: classes.listItemRoot, secondary: classes.secondary }}
                    primary={group ? group.DisplayName : ''}
                    secondary={this.shortenPath(group ? group.Path : '')}
                    onClick={(e) => this.handleClick(group ? group.Path : '')} />
            </MenuItem>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GroupListItem)))
