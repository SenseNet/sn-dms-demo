// import Checkbox from '@material-ui/core/Checkbox'
// import { Reducers } from '@sensenet/redux'

// import { withStyles } from '@material-ui/core'
// import createStyles from '@material-ui/core/styles/createStyles'
// import TableCell from '@material-ui/core/TableCell'
// import TableRow from '@material-ui/core/TableRow'
// import CheckBoxIcon from '@material-ui/icons/CheckBox'
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
// import { GenericContent } from '@sensenet/default-content-types'
// import * as React from 'react'
// import { connect } from 'react-redux'
// import MediaQuery from 'react-responsive'
// import * as DMSActions from '../../Actions'
// import DisplayNameCell from './TableCells/DisplayNameCell'
// import MenuCell from './TableCells/MenuCell'
// import ReferenceCell from './TableCells/ReferenceCell'

// const styles = {
//     selectedRow: {

//     },
//     checkboxButton: {
//         width: 30,
//         cursor: 'pointer' as any,
//     },
//     checkbox: {
//         opacity: 0,
//     },
//     selectedCheckbox: {
//         opacity: 1,
//     },
//     hoveredCheckbox: {
//         opacity: 1,
//     },
//     row: {
//         WebkitTouchCallout: 'none' as any,
//         WebkitUserSelect: 'none' as any,
//         KhtmlUserSelect: 'none' as any,
//         MozUserSelect: 'none' as any,
//         MsUserSelect: 'none' as any,
//         UserSelect: 'none' as any,
//     },
// }

// const style = (theme) => createStyles({
//     root: {
//         fontSize: 16,
//         fontFamily: 'Raleway Light',
//     },
//     tablecell: {
//         fontSize: 16,
//         fontFamily: 'Raleway Light',
//     },
//     sizeIcon: {
//         fontSize: 22,
//         fontWeight: 'normal',
//     },
//     body: {
//         fontSize: 16,
//         fontFamily: 'Raleway Light',
//     },
// })

// interface SimpleTableRowProps {
//     content: GenericContent,
//     opened: number,
//     openActionMenu,
//     closeActionMenu,
//     selected,
//     handleRowDoubleClick,
//     handleRowSingleClick,
//     handleTap,
//     selectionModeOn,
//     selectionModeOff,
//     isCopy: boolean,
//     classes
// }

// interface SimpleTableRowState {
//     hovered,
//     opened,
//     actionMenuIsOpen,
//     anchorEl,
//     selected
// }

// class SimpleTableRow extends React.Component<SimpleTableRowProps, SimpleTableRowState> {
//     constructor(props) {
//         super(props)

//         this.state = {
//             selected: [],
//             hovered: null,
//             opened: this.props.opened,
//             actionMenuIsOpen: false,
//             anchorEl: null,
//         }
//         this.handleContextMenu = this.handleContextMenu.bind(this)
//         this.handleIconTap = this.handleIconTap.bind(this)
//         this.handleClick = this.handleClick.bind(this)
//         this.handleDoubleClick = this.handleDoubleClick.bind(this)
//     }

//     public handleContextMenu(e, content) {
//         const top = e.pageY - e.target.offsetTop
//         const left = e.pageX
//         e.preventDefault()
//         this.props.openActionMenu(content.Actions, content.Id, content.DisplayName, e.currentTarget,
//             { top, left })
//     }

//     public handleRowMouseEnter(e, id) {
//         this.setState({
//             hovered: id,
//         })
//     }
//     public handleRowMouseLeave() {
//         this.setState({
//             hovered: null,
//         })
//     }
//     public isSelected(id) {
//         return this.props.selected.indexOf(id) > -1
//     }
//     public isHovered(id) {
//         return this.state.hovered === id
//     }

//     public handleIconTap(e, content) {
//         this.props.handleRowSingleClick(e, content)
//     }
//     public handleClick(e, content) {
//         this.props.handleRowSingleClick(e, content)
//     }
//     public handleDoubleClick(e, id, type) {
//         this.props.handleRowDoubleClick(e, id, type)
//     }
//     public render() {
//         const { content, handleTap, isCopy, classes } = this.props
//         const isSelected = this.isSelected(content.Id)
//         const isHovered = this.isHovered(content.Id)
//         return (
//             <TableRow
//                 hover
//                 // onKeyDown={event => this.handleKeyDown(event, content.Id, content.Type)}
//                 role="checkbox"
//                 aria-checked={isSelected}
//                 aria-owns="actionmenu"
//                 tabIndex={-1}
//                 onMouseEnter={(event) => this.handleRowMouseEnter(event, content.Id)}
//                 onMouseLeave={(event) => this.handleRowMouseLeave()}
//                 selected={isSelected}
//                 style={isSelected ? { ...styles.selectedRow, ...styles.row } :
//                     styles.row}
//                 className={classes.tablecell}
//                 onContextMenu={(event) => this.handleContextMenu(event, content)}
//             >
//                 <MediaQuery minDeviceWidth={700}>
//                     <TableCell
//                         padding="none"
//                         style={styles.checkboxButton}
//                         onClick={(event) => this.handleClick(event, content)}
//                         onDoubleClick={(event) => this.handleDoubleClick(event, content.Id, content.Type)}>
//                         <div>
//                             <Checkbox
//                                 checked={isSelected}
//                                 color="primary"
//                                 classes={{
//                                     root: classes.root,
//                                 }}
//                                 icon={<CheckBoxOutlineBlankIcon className={classes.sizeIcon} />}
//                                 checkedIcon={<CheckBoxIcon className={classes.sizeIcon} />}
//                             />
//                         </div>
//                     </TableCell>
//                 </MediaQuery>
//                 {/* <MediaQuery minDeviceWidth={700}>
//                     {(matches) => {
//                         return <IconCell
//                             id={content.Id}
//                             icon={content.Icon}
//                             selected={isSelected}
//                             handleRowSingleClick={(event) => matches ? handleRowSingleClick(event, content) : this.handleIconTap(event, content)}
//                             handleRowDoubleClick={(event) => matches ? handleRowDoubleClick(event, content.Id, content.Type) : event.preventDefault()} />
//                     }}
//                 </MediaQuery> */}
//                 <MediaQuery minDeviceWidth={700}>
//                     {(matches) => {
//                         return <DisplayNameCell
//                             content={content}
//                             isHovered={isHovered}
//                             icon={content.Icon}
//                             handleRowSingleClick={(event) => matches ? this.handleClick(event, content) : handleTap(event, content, content.Type)}
//                             handleRowDoubleClick={(event) => matches ? this.handleDoubleClick(event, content.Id, content.Type) : event.preventDefault()}
//                             isCopy={isCopy}
//                             isSelected={isSelected} />
//                     }}
//                 </MediaQuery>
//                 <MediaQuery minDeviceWidth={700}>
//                     {/* <DateCell
//                         isHovered={isHovered}
//                         content={content}
//                         date={content.ModificationDate}
//                         handleRowDoubleClick={this.props.handleRowDoubleClick}
//                         handleRowSingleClick={this.props.handleRowSingleClick}
//                         isCopy={isCopy}
//                         isSelected={isSelected} /> */}
//                 </MediaQuery>
//                 <MediaQuery minDeviceWidth={700}>
//                     {(matches) => {
//                         return <ReferenceCell
//                             isHovered={isHovered}
//                             content={content}
//                             handleRowDoubleClick={this.props.handleRowDoubleClick}
//                             handleRowSingleClick={this.props.handleRowSingleClick}
//                             isCopy={isCopy}
//                             fieldName="Owner"
//                             optionName="FullName"
//                             isSelected={isSelected} />
//                     }}
//                 </MediaQuery>
//                 <MediaQuery minDeviceWidth={700}>
//                     {(matches) => {
//                         return <MenuCell
//                             content={content}
//                             isHovered={matches ? isHovered : true}
//                             isSelected={isSelected}
//                             actionMenuIsOpen={this.state.actionMenuIsOpen} />
//                     }}
//                 </MediaQuery>
//             </TableRow>
//         )
//     }
// }

// const mapStateToProps = (state, match) => {
//     return {
//         selected: Reducers.getSelectedContentIds(state.sensenet),
//         opened: Reducers.getOpenedContent(state.sensenet.currentitems),
//         ids: Reducers.getIds(state.sensenet.currentitems),
//     }
// }
// export default connect(mapStateToProps, {
//     openActionMenu: DMSActions.openActionMenu,
//     closeActionMenu: DMSActions.closeActionMenu,
//     selectionModeOn: DMSActions.selectionModeOn,
//     selectionModeOff: DMSActions.selectionModeOff,
// })(withStyles(style)(SimpleTableRow))
