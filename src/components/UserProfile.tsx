import AppBar from '@material-ui/core/AppBar'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Toolbar from '@material-ui/core/Toolbar'
import { ConstantContent } from '@sensenet/client-core'
import { GenericContent, IActionModel } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '..'
import { closeActionMenu, openActionMenu } from '../Actions'
import { contentListTheme } from '../assets/contentlist'
import { icons } from '../assets/icons'
import { customSchema } from '../assets/schema'
import WorkspaceSelector from '../components/WorkspaceSelector/WorkspaceSelector'
import { loadUser, select, updateChildrenOptions } from '../store/usersandgroups/actions'
import BreadCrumb from './BreadCrumb'
import { DisplayNameCell } from './ContentList/CellTemplates/DisplayNameCell'
import { DisplayNameMobileCell } from './ContentList/CellTemplates/DisplayNameMobileCell'
import {DeleteUserFromGroup} from './UsersAndGroups/DeleteUserFromGroup'
import UserInfo from './UsersAndGroups/UserInfo'

const styles = {
    appBar: {
        background: '#fff',
    },
    appBarMobile: {
        background: '#4cc9f2',
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0 12px',
    },
    toolbarMobile: {
        padding: '0',
        minHeight: 36,
        borderBottom: 'solid 1px #fff',
        display: 'flex',
        flexDirection: 'row',
    },
}

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        items: state.dms.usersAndGroups.user.memberships,
        errorMessage: state.dms.usersAndGroups.user.error,
        editedItemId: state.dms.editedItemId,
        ancestors: state.dms.usersAndGroups.user.ancestors,
        user: state.dms.usersAndGroups.user.currentUser,
        isAdmin: state.dms.usersAndGroups.user.isAdmin,
        childrenOptions: state.dms.usersAndGroups.user.grouplistOptions,
        selected: state.dms.usersAndGroups.user.selected,
        active: state.dms.usersAndGroups.user.active,
        hostName: state.sensenet.session.repository.repositoryUrl,
    }
}

const mapDispatchToProps = {
    loadUser,
    openActionMenu,
    closeActionMenu,
    select,
    updateChildrenOptions,
}

interface UserProfileProps extends RouteComponentProps<any> {
    matchesDesktop,
}

interface UserProfileState {
    userName: string,
}

class UserProfile extends React.Component<UserProfileProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, UserProfileState> {
    constructor(props: UserProfile['props']) {
        super(props)
        this.state = {
            userName: '',
        }
    }

    private static updateStoreFromPath(newProps: UserProfile['props'], lastState: UserProfile['state']) {
        try {
            const idFromUrl = newProps.match.params.folderPath && atob(decodeURIComponent(newProps.match.params.otherActions))
            const userProfilePath = `/Root/IMS/Public/${newProps.loggedinUser.content.Name}`
            newProps.loadUser(Number(idFromUrl) || userProfilePath, { select: ['Avatar', 'FullName', 'Email', 'Phone', 'LoginName'] })
        } catch (error) {
            /** Cannot parse current folder from URL */
            return compile(newProps.match.path)({ folderPath: '' })
        }
    }

    public static getDerivedStateFromProps(newProps: UserProfile['props'], lastState: UserProfile['state']) {
        if (newProps.user === null || newProps.user.Name !== lastState.userName) {
            const newPath = UserProfile.updateStoreFromPath(newProps, lastState)
            if (newPath && newPath !== newProps.match.url) {
                newProps.history.push(newPath)
            }
        }
        return {
            ...lastState,
            userName: newProps.user ? newProps.user.Name : '',
        } as UserProfile['state']
    }

    public handleRowDoubleClick(e: React.MouseEvent, content: GenericContent) {
        if (content.IsFolder) {
            const newPath = compile(this.props.match.path)({ folderPath: btoa(content.Path) })
            this.props.history.push(newPath)
        } else {
            const newPath = compile(this.props.match.path)({ folderPath: this.props.match.params.folderPath || btoa(this.props.user.Path as any), otherActions: ['preview', btoa(content.Id as any)] })
            this.props.history.push(newPath)
        }
    }

    public render() {
        const { matchesDesktop } = this.props
        return <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                return this.props.loggedinUser.content.Id !== ConstantContent.VISITOR_USER.Id ?
                    <div>
                        {this.props.isAdmin ? <AppBar position="static" style={matches ? styles.appBar : styles.appBarMobile}>
                            <Toolbar style={matches ? styles.toolbar as any : styles.toolbarMobile as any}>
                                <div style={{ flex: 1, display: 'flex' }}>
                                    <WorkspaceSelector />
                                    <BreadCrumb ancestors={this.props.ancestors} currentContent={this.props.user} />
                                </div>
                            </Toolbar>
                        </AppBar> : null}
                        <UserInfo />
                        <MuiThemeProvider theme={contentListTheme}>
                            <ContentList
                                displayRowCheckbox={matches ? true : false}
                                items={this.props.items.d.results}
                                schema={customSchema.find((s) => s.ContentTypeName === 'GenericContent')}
                                fieldsToDisplay={matches ? ['DisplayName', 'Workspace', 'Actions'] :
                                    ['DisplayName', 'Actions']}
                                icons={icons}
                                orderBy={this.props.childrenOptions.orderby[0][0] as any}
                                orderDirection={this.props.childrenOptions.orderby[0][1] as any}
                                onRequestSelectionChange={(newSelection) => this.props.select(newSelection)}
                                onRequestActionsMenu={(ev, content) => {
                                    ev.preventDefault()
                                    this.props.closeActionMenu()
                                    this.props.openActionMenu(content.Actions as IActionModel[], content, '', ev.currentTarget.parentElement, { top: ev.clientY, left: ev.clientX })
                                }}
                                onItemContextMenu={(ev, content) => {
                                    ev.preventDefault()
                                    this.props.closeActionMenu()
                                    this.props.openActionMenu(content.Actions as IActionModel[], content, '', ev.currentTarget.parentElement, { top: ev.clientY, left: ev.clientX })
                                }}
                                onRequestOrderChange={(field, direction) => {
                                    this.props.updateChildrenOptions({
                                        ...this.props.childrenOptions,
                                        orderby: [[field, direction]],
                                    })
                                }}
                                onItemClick={(ev, content) => {
                                    if (ev.ctrlKey) {
                                        if (this.props.selected.find((s) => s.Id === content.Id)) {
                                            this.props.select(this.props.selected.filter((s) => s.Id !== content.Id))
                                        } else {
                                            this.props.select([...this.props.selected, content])
                                        }
                                    } else if (ev.shiftKey) {
                                        const activeIndex = this.props.items.d.results.findIndex((s) => s.Id === this.props.active.Id)
                                        const clickedIndex = this.props.items.d.results.findIndex((s) => s.Id === content.Id)
                                        const newSelection = Array.from(new Set([...this.props.selected, ...[...this.props.items.d.results].slice(Math.min(activeIndex, clickedIndex), Math.max(activeIndex, clickedIndex) + 1)]))
                                        this.props.select(newSelection)
                                    } else if (!this.props.selected.length || this.props.selected.length === 1 && this.props.selected[0].Id !== content.Id) {
                                        this.props.select([content])
                                    }
                                }}
                                selected={this.props.selected}
                                onItemDoubleClick={this.handleRowDoubleClick}
                                fieldComponent={(props) => {
                                    switch (props.field) {
                                        case 'DisplayName':
                                            if (!matchesDesktop) {
                                                return (<DisplayNameMobileCell
                                                    content={props.content}
                                                    isSelected={props.isSelected}
                                                    hasSelected={props.selected.length > 0}
                                                    icons={icons}
                                                    onActivate={(ev, content) => this.handleRowDoubleClick(ev, content)} />)
                                            } else {
                                                return (<DisplayNameCell
                                                    content={props.content}
                                                    isSelected={props.isSelected}
                                                    icons={icons}
                                                    hostName={this.props.hostName} />)
                                            }
                                        case 'Actions':
                                            return <DeleteUserFromGroup />
                                        default:
                                            return null
                                    }
                                }
                                }
                            />
                        </MuiThemeProvider>
                    </div>
                    : null

            }}
        </MediaQuery>
    }
}

export default withRouter(connect<ReturnType<typeof mapStateToProps>, typeof mapDispatchToProps, UserProfileProps>(mapStateToProps, mapDispatchToProps)(UserProfile))
