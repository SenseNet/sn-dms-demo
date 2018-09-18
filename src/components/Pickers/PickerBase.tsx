import { Dialog, DialogTitle, Drawer, MuiThemeProvider } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import BackIcon from '@material-ui/icons/ArrowBack'
import CloseIcon from '@material-ui/icons/Close'
import { GenericContent } from '@sensenet/default-content-types'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '../..'
import { pickerTheme } from '../../assets/picker'
import { deselectPickeritem, loadPickerItems, loadPickerParent, selectPickerItem, setBackLink, setPickerParent } from '../../store/picker/actions'

// tslint:disable-next-line:no-var-requires
const sensenetLogo = require('../../assets/sensenet_white.png')

const mapStateToProps = (state: rootStateType) => {
    return {
        open: state.dms.picker.isOpened,
        anchorElement: state.dms.actionmenu.anchorElement,
        onClose: state.dms.picker.pickerOnClose,
        parent: state.dms.picker.parent,
        items: state.dms.picker.items,
        selected: state.dms.documentLibrary.selected,
        closestWs: state.dms.picker.closestWorkspace,
        backLink: state.dms.picker.backLink,
        pickerContent: state.dms.picker.content,
    }
}

const mapDispatchToProps = {
    selectPickerItem,
    deselectPickeritem,
    loadPickerParent,
    loadPickerItems,
    setPickerParent,
    setBackLink,
}

const styles = {
    snButton: {
        flex: '0 0 auto',
        width: 48,
        height: 48,
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        justifyContent: 'center',
    },
    snLogo: {
        width: '1em',
        height: '1em',
        display: 'inline-block',
        flexShrink: 0,
    },
}

class Picker extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    constructor(props: Picker['props']) {
        super(props)
    }
    public handleClose = () => {
        this.props.onClose()
    }
    public isLastItem = () => {
        const { parent, closestWs } = this.props
        return parent.Path === closestWs
    }
    public handleClickBack = () => {
        const { parent } = this.props
        if (this.isLastItem()) {
            this.props.setBackLink(false)
            const snContent = {
                DisplayName: 'sensenet',
                Workspace: {
                    Path: null,
                },
            } as GenericContent
            this.props.setPickerParent(snContent)
            this.props.loadPickerItems('/', snContent,
                {
                    query: 'TypeIs:Workspace -TypeIs:Site',
                    select: ['DisplayName', 'Id', 'Path', 'Children'],
                    orderby: [['DisplayName', 'asc']],
                })
            this.props.deselectPickeritem()
        } else {
            this.props.loadPickerParent(parent.ParentId)
            this.props.loadPickerItems(parent.Path.substr(0, parent.Path.length - (parent.Name.length + 1)), { Id: parent.ParentId } as GenericContent)
            this.props.deselectPickeritem()
        }
    }
    public render() {
        const { backLink, open, parent } = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) =>
                    <MuiThemeProvider theme={pickerTheme}>
                        {matches ? <Dialog
                            open={open}
                            onClose={this.handleClose}>
                            <DialogTitle>
                                <Toolbar>
                                    {backLink ?
                                        <IconButton color="inherit" onClick={() => this.handleClickBack()}>
                                            <BackIcon />
                                        </IconButton> :
                                        <div style={styles.snButton}>
                                            <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={styles.snLogo} />
                                        </div>}
                                    <Typography variant="title" color="inherit">
                                        {parent ? parent.DisplayName : 'Move content'}
                                    </Typography>
                                    <IconButton color="inherit" onClick={this.handleClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Toolbar>
                            </DialogTitle>
                            {this.props.pickerContent}
                        </Dialog> :
                            <Drawer
                                anchor="bottom"
                                open={open}
                                onClose={this.handleClose}>
                                <DialogTitle>
                                    <Toolbar>
                                        {backLink ?
                                            <IconButton color="inherit" onClick={() => this.handleClickBack()}>
                                                <BackIcon />
                                            </IconButton> :
                                            <div style={styles.snButton}>
                                                <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={styles.snLogo} />
                                            </div>}
                                        <Typography variant="title" color="inherit">
                                            {parent ? parent.DisplayName : 'Move content'}
                                        </Typography>
                                        <IconButton color="inherit" onClick={this.handleClose}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Toolbar>
                                </DialogTitle>
                                {this.props.pickerContent}
                            </Drawer>}
                    </MuiThemeProvider>
                }
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Picker)
