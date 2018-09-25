import { Checkbox, TableCell, Tooltip } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../../..'
import { resources } from '../../../assets/resources'
import { select, setActive } from '../../../store/documentlibrary/actions'
import { DocumentState } from './LockedCell'

export interface DisplayNameMobilCellProps {
    content: GenericContent
    isSelected: boolean
    hasSelected: boolean
    icons: any
    select: (selection: GenericContent[]) => void
    onActivate: (ev: React.MouseEvent, content: GenericContent) => void
}

const styles = {
    cell: {
        width: 100,
    },
    lockedCellContainer: {
        textAlign: 'center',
        marginLeft: '20px',
    },
    userName: {
        fontFamily: 'Raleway Semibold',
        fontStyle: 'italic',
        fontSize: 11,
        display: 'block',
    },
    icon: {
        display: 'block',
        fontSize: 20,
    },
}

const mapStateToProps = (state: rootStateType) => ({
    selected: state.dms.documentLibrary.selected,
    currentUserName: state.sensenet.session.user.userName,
})
const mapDispatchToProps = {
    select,
    setActive,
}
class DisplayNameMobileCell extends React.Component<DisplayNameMobilCellProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, {}> {
    public getStatus = (content) => {
        if (content.Approvable) {
            return DocumentState.Approvable
        } else if (content.CheckedOutTo) {
            return DocumentState.CheckedOut
        } else {
            return DocumentState.Default
        }
    }
    constructor(props: DisplayNameMobileCell['props']) {
        super(props)
        this.handleContentSelection = this.handleContentSelection.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleDisplayNameClick = this.handleDisplayNameClick.bind(this)
    }

    private handleContentSelection(ev: React.MouseEvent) {
        ev.preventDefault()
        ev.stopPropagation()
        if (this.props.selected.find((c) => c.Id === this.props.content.Id)) {
            this.props.select(this.props.selected.filter((s) => s.Id !== this.props.content.Id))
        } else {
            this.props.select([...this.props.selected, this.props.content])
        }
    }

    private handleDisplayNameClick(ev: React.MouseEvent) {
        ev.preventDefault()
        ev.stopPropagation()
        this.props.onActivate(ev, this.props.content)
    }

    private handleOnClick(ev: React.MouseEvent) {
        ev.preventDefault()
        ev.stopPropagation()
        this.props.setActive(this.props.content)
    }

    public state = {
        status: this.getStatus(this.props.content),
    }

    public lockedByName = (content) => {
        // tslint:disable-next-line:no-string-literal
        if (content['CheckedOutTo'].Name === this.props.currentUserName) {
            return 'Me'
        } else {
            // tslint:disable-next-line:no-string-literal
            return content['CheckedOutTo'].FullName
        }
    }

    public render() {
        const icon = this.props.content.Icon && this.props.icons[this.props.content.Icon.toLowerCase() as any]
        const { content } = this.props
        const checkedOutBy = content.CheckedOutTo ? this.lockedByName(content) : null
        let typeOfIcon
        switch (this.props.content.Icon) {
            case 'word':
            case 'excel':
            case 'acrobat':
            case 'powerpoint':
                typeOfIcon = iconType.flaticon
                break
            default:
                typeOfIcon = iconType.materialui
                break
        }
        return (<TableCell className="display-name" padding="checkbox" onClick={this.handleOnClick}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {this.props.hasSelected ?
                    <Checkbox
                        style={{ marginRight: '12px' }}
                        checked={this.props.isSelected}
                        onClick={this.handleContentSelection}
                    />
                    :

                    <span>
                        {icon ?
                            <Icon
                                style={{ marginRight: '.5em' }}
                                onClick={this.handleContentSelection}
                                type={typeOfIcon}
                                iconName={icon} />
                            : null}
                    </span>
                }
                <div onClick={this.handleDisplayNameClick}>{this.props.content.DisplayName || this.props.content.Name}</div>
                {content.Locked ?
                    this.state.status === DocumentState.CheckedOut ?
                        <Tooltip title={`${resources.CHECKED_OUT_BY}${checkedOutBy}`}>
                            <div style={styles.lockedCellContainer as any}>
                                {/*<span style={styles.userName}>{checkedOutBy}</span> */}
                                <span style={styles.icon}>
                                    <Icon
                                        style={{ fontSize: 20 }}
                                        type={iconType.materialui}
                                        iconName="lock" />
                                </span>
                            </div>
                        </Tooltip> :
                        null :
                    this.state.status === DocumentState.Approvable ?
                        <Tooltip title={resources.APPROVABLE}>
                            <div style={styles.lockedCellContainer as any}>
                                <span style={styles.icon}>
                                    <Icon
                                        style={{ fontSize: 20 }}
                                        type={iconType.materialui}
                                        iconName="access_time" /></span>
                            </div>
                        </Tooltip> :
                        null
                }
            </div>
        </TableCell>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DisplayNameMobileCell)

export { connectedComponent as DisplayNameMobileCell }
