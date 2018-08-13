import Icon from '@material-ui/core/Icon'
import TableCell from '@material-ui/core/TableCell'
import TextField from '@material-ui/core/TextField'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import MediaQuery from 'react-responsive'
import { icons } from '../../../assets/icons'

const styles = {
    displayNameDiv: {
        width: '100%',
        display: 'flex',
        position: 'relative',
        boxSizing: 'border-box',
        textAlign: 'left',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textDecoration: 'none',
    },
    selectedDisplayNameDiv: {
        color: '#016D9E',
        fontFamily: 'Raleway Semibold',
    },
    editedTitle: {
        fontStyle: 'italic' as any,
    },
    icon: {
        verticalAlign: 'middle',
        flexShrink: 0,
        width: '1em',
        height: '1em',
        display: 'inline-block',
        fontSize: 30,
    },
    title: {
        flex: '1 1 auto',
        padding: '0 16px',
        minWidth: 0,
        whiteSpace: 'nowrap' as any,
    },
}

interface DisplayNameCellProps {
    content: GenericContent,
    updateContent: (newContent: GenericContent) => any
    isSelected: boolean
}

interface DisplayNameCellState {
    oldText,
    newText,
    edited,
    displayName
}

export class DisplayNameCell extends React.Component<DisplayNameCellProps, DisplayNameCellState> {
    private input: HTMLInputElement
    constructor(props) {
        super(props)

        this.state = {
            oldText: this.props.content.DisplayName,
            newText: '',
            edited: false,
            displayName: this.props.content.DisplayName,
        }

        this.handleTitleClick = this.handleTitleClick.bind(this)
        this.handleTitleInputBlur = this.handleTitleInputBlur.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
    }
    public handleTitleClick(e, id) {
        if (e.target.id !== 'renameInput') {
            e.preventDefault()
        }
    }
    public handleTitleChange(e) {
        this.setState({
            newText: e.target.value,
        })
    }
    public handleTitleInputBlur(id, mobile) {
        // if (!mobile) {
        //     if (this.state.newText !== '' && this.state.oldText !== this.state.newText) {
        //         this.updateDisplayName()
        //     } else {
        //         this.setState({
        //             edited: null,
        //             newText: '',
        //         })
        //     }
        // } else {
        //     if (this.props.editedFirst) {
        //         this.input.focus()
        //         this.props.setEditedFirst(false)
        //     } else {
        //         if (this.state.newText !== '' && this.state.oldText !== this.state.newText) {
        //             this.updateDisplayName()
        //         } else {
        //             this.setState({
        //                 edited: null,
        //                 newText: '',
        //             })
        //             this.props.setEdited(null)
        //         }
        //     }
        // }
    }
    public handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.updateDisplayName()
        }
    }
    public updateDisplayName() {
        const c = this.props.content
        const updateableContent = c
        updateableContent.DisplayName = this.state.newText
        this.props.updateContent(updateableContent)
        this.setState({
            edited: null,
            newText: '',
            displayName: this.state.newText,
        })
    }
    public render() {
        const { content, isSelected } = this.props
        const iconColor = content.Icon.toLowerCase() !== 'folder' || isSelected ? 'primary' : 'disabled'
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <TableCell
                        padding="none">
                        {this.state.edited ?
                            <div>
                                <Icon color="primary" style={styles.icon}>{icons[content.Icon.toLowerCase()]}</Icon>
                                <TextField
                                    id="renameInput"
                                    autoFocus={this.state.edited}
                                    defaultValue={this.props.content.DisplayName}
                                    margin="dense"
                                    style={styles.editedTitle as any}
                                    onChange={(event) => this.handleTitleChange(event)}
                                    onKeyPress={(event) => this.handleKeyPress(event)}
                                    onBlur={(event) => this.handleTitleInputBlur(this.props.content.Id, !matches)}
                                    inputRef={(ref) => this.input = ref}
                                />
                            </div> :
                            <div
                                onClick={(event) => matches ? this.handleTitleClick(event, this.props.content.Id) : event.preventDefault()}
                                style={isSelected ? { ...styles.selectedDisplayNameDiv, ...styles.displayNameDiv } : styles.displayNameDiv as any}>
                                <Icon color={iconColor} style={styles.icon}>{icons[content.Icon.toLowerCase()]}</Icon>
                                <div style={styles.title}>{this.state.displayName}</div>
                            </div>
                        }
                    </TableCell>
                }}
            </MediaQuery>
        )
    }
}

export default DisplayNameCell
