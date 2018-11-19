import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { File as SnFile, Folder, GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Query } from '@sensenet/query'
import { AdvancedSearch, AdvancedSearchOptions, PresetField, TextField } from '@sensenet/search-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { repository, rootStateType } from '../..'
import { resources } from '../../assets/resources'
import { loadParent, setChildrenOptions, updateSearchValues } from '../../store/documentlibrary/actions'
import { DocumentLibraryState } from '../../store/documentlibrary/reducers'
import { closePicker, openPicker, setPickerParent } from '../../store/picker/actions'
import PathPicker from '../Pickers/PathPicker'
import QuickSearchBox from './SearchInput'

const styles = {
    searchContainerMobile: {
        flex: 5,
    },
    searchButton: {
        color: '#fff',
        marginRight: -10,
        height: 36,
    },
}

const mapStateToProps = (state: rootStateType) => ({
    ancestors: state.dms.documentLibrary.ancestors,
    query: state.dms.documentLibrary.childrenOptions.query,
    parent: state.dms.documentLibrary.parent,
    searchState: state.dms.documentLibrary.searchState,
    selectedTypeRoot: state.dms.picker.selected,
    isLoading: state.dms.documentLibrary.isLoading,
})

const mapDispatchToProps = {
    setChildrenOptions,
    loadParent,
    updateSearchValues,
    setPickerParent,
    openPicker,
    closePicker,
}

interface SearchDocumentsState {
    parent: GenericContent
    isOpen: boolean, query: string
}

class SearchDocuments extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { style?: React.CSSProperties }, SearchDocumentsState> {
    constructor(props) {
        super(props)
        this.state = {
            parent: this.props.parent,
            isOpen: false,
            query: this.props.query,
        }
        this.handleOnSubmit = this.handleOnSubmit.bind(this)
        this.handleQueryChanged = this.handleQueryChanged.bind(this)
        this.handleFieldQueryChanged = this.handleFieldQueryChanged.bind(this)
        this.handlePickLocation = this.handlePickLocation.bind(this)
        this.handleSelectTypeRoot = this.handleSelectTypeRoot.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }
    public onClick = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    private handleQueryChanged(innerQuery: Query<any>) {
        if (innerQuery.toString()) {
            this.setState({
                query: new Query((q) =>
                    q.query((typeQuery) =>
                        typeQuery.type(SnFile)
                            .or
                            .type(Folder),
                    )
                        .and
                        .query(innerQuery),
                ).toString(),
            })

        } else {
            this.setState({ query: '' })
        }
    }

    private handleFieldQueryChanged(key: keyof DocumentLibraryState['searchState'], value: Query<any>, plainValue: string, callback: (key: string, value: Query<any>) => void) {
        const update = {}
        update[key] = plainValue
        this.props.updateSearchValues(update)
        callback(key, value)
    }

    private handleOnSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        /** */
        if (this.state.query !== this.props.query) {
            this.props.setChildrenOptions({
                // path: this.props.searchState.rootPath,
                query: this.state.query.toString(),
            })
            this.props.loadParent(this.state.parent ? this.state.parent.Id : this.props.parent.Id)
            this.handleClose()
        }
    }

    private handlePickLocation(ev: React.MouseEvent, options: AdvancedSearchOptions<any>) {
        this.props.setPickerParent(this.props.parent)
        this.props.openPicker(
            <PathPicker
                showAddFolder={false}
                mode="SearchRoot"
                dialogTitle={resources.SEARCH_LOCATION_TITLE}
                loadOptions={{}}
                onSelect={(content) => this.handleSelectTypeRoot(content, options)}
            />,
            'selectSearchRoot',
            this.props.closePicker,
        )
    }

    private handleSelectTypeRoot(content: GenericContent, options: AdvancedSearchOptions<any>) {
        this.props.updateSearchValues({
            rootPath: content.Path,
        })
        this.setState({
            parent: content,
        })
        options.updateQuery('InTree', new Query((q) => q.inTree(content.Path)))
        this.props.closePicker()
    }

    private handleClose() {
        this.setState({
            isOpen: false,
        })
    }

    private elementRef: HTMLElement | null = null
    private searchBoxContainerRef: HTMLElement | null = null

    public render() {
        const titleWidth = 2
        const contentWidth = 7
        const containerStyles: React.CSSProperties = {
            padding: '1em',
        }

        const titleStyles: React.CSSProperties = {
            margin: '1em 0',
        }
        return (
            <AdvancedSearch
                schema={repository.schemas.getSchema(GenericContent)}
                onQueryChanged={this.handleQueryChanged}
                style={{ width: '100%' }}
                fields={(options) => <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        if (matches) {
                            return <form style={{ ...matches ? null : styles.searchContainerMobile, ...this.props.style }} onSubmit={this.handleOnSubmit}>
                                <QuickSearchBox {...this.props}
                                    isLoading={this.state.query && this.props.isLoading}
                                    isOpen={matches ? this.state.isOpen : true}
                                    onClick={this.onClick}
                                    startAdornmentRef={(r) => { (this.elementRef = r) }}
                                    containerRef={(r) => this.searchBoxContainerRef = r}
                                    inputProps={{
                                        style: {
                                            width: '100%',
                                        },
                                        value: this.props.searchState.searchString,
                                        placeholder: resources.SEARCH_DOCUMENTS_PLACEHOLDER,
                                        onChange: (ev) => {
                                            const term = ev.currentTarget.value
                                            this.props.updateSearchValues({ searchString: term })
                                            this.handleFieldQueryChanged('searchString', new Query((q) => term ? q
                                                .equals('Name', `*${term}*`)
                                                .or
                                                .equals('DisplayName', `*${term}*`) : q,
                                            ), term, options.updateQuery)
                                        },
                                    }}
                                    containerProps={{
                                        style: {
                                            width: '60%',
                                            minWidth: '450px',
                                        },
                                    }}
                                />
                                <Popover
                                    BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,.1)' } }}
                                    disablePortal
                                    onBackdropClick={this.handleClose}
                                    open={this.state.isOpen}
                                    anchorEl={this.elementRef}
                                    anchorOrigin={{
                                        horizontal: 'left',
                                        vertical: 'bottom',
                                    }}
                                    PaperProps={{
                                        style: {
                                            width: this.searchBoxContainerRef && this.searchBoxContainerRef.offsetWidth,
                                            overflow: 'hidden',
                                        },
                                    }}
                                >
                                    <Grid container spacing={24} style={containerStyles}>
                                        <Grid item xs={titleWidth} >
                                            <Typography style={titleStyles} variant="body1">Type</Typography>
                                        </Grid>
                                        <Grid item xs={contentWidth}>
                                            <PresetField fullWidth fieldName="Type"
                                                value={this.props.searchState.type || 'Any'}
                                                presets={[
                                                    { text: 'Any', value: new Query((q) => q) },
                                                    { text: 'Document', value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'word')) },
                                                    { text: 'Sheet', value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'excel')) },
                                                    { text: 'Text', value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'document')) },
                                                    { text: 'Slide', value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'powerpoint')) },
                                                    { text: 'Folder', value: new Query((q) => q.typeIs(Folder)) },
                                                ]}
                                                onQueryChange={(key, query, name) => this.handleFieldQueryChanged('type', query, name, options.updateQuery)}
                                            />
                                        </Grid>
                                        <Grid xs={3} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <IconButton onClick={this.handleClose}>
                                                <Icon iconName="close" />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={titleWidth}>
                                            <Typography style={titleStyles} variant="body1">Owner</Typography>
                                        </Grid>
                                        <Grid item xs={contentWidth}>
                                            <TextField
                                                fullWidth
                                                placeholder={resources.SEARCH_OWNER_PLACEHOLDER}
                                                fieldName={'Owner'}
                                                onQueryChange={(key, query, plainValue) => this.handleFieldQueryChanged('owner', query, plainValue, options.updateQuery)}
                                                value={this.props.searchState.owner}
                                            />
                                        </Grid>
                                        <Grid item xs={3} />
                                        <Grid item xs={titleWidth}>
                                            <Typography style={titleStyles} variant="body1">Shared with</Typography>
                                        </Grid>
                                        <Grid item xs={contentWidth}>
                                            <TextField
                                                fullWidth
                                                placeholder={resources.SEARCH_SHAREDWITH_PLACEHOLDER}
                                                fieldName={'SharedWith'}
                                                onQueryChange={(key, query, plainValue) => this.handleFieldQueryChanged('sharedWith', query, plainValue, options.updateQuery)}
                                                value={this.props.searchState.sharedWith}

                                            />
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    <Grid container spacing={24} style={containerStyles}>
                                        <Grid item xs={titleWidth}>
                                            <Typography style={titleStyles} variant="body1">Item name</Typography>
                                        </Grid>
                                        <Grid item xs={contentWidth}>
                                            <TextField
                                                fullWidth
                                                placeholder={resources.SEARCH_ITEMNAME_PLACEHOLDER}
                                                fieldName={'DisplayName'}
                                                onQueryChange={(key, query, plainValue) => this.handleFieldQueryChanged('itemName', query, plainValue, options.updateQuery)}
                                                value={this.props.searchState.itemName}
                                            />
                                        </Grid>
                                        <Grid item xs={3} />
                                        <Grid item xs={titleWidth}>
                                            <Typography style={titleStyles} variant="body1">Date modified</Typography>
                                        </Grid>
                                        <Grid item xs={contentWidth}>
                                            <PresetField
                                                fullWidth
                                                fieldName="ModificationDate"
                                                presets={[
                                                    { text: '-', value: new Query((a) => a) },
                                                    { text: 'Today', value: new Query((a) => a.term('CreationDate:>@@Today@@')) },
                                                    { text: 'Yesterday', value: new Query((a) => a.term('CreationDate:>@@Yesterday@@').and.term('CreationDate:<@@Today@@')) },
                                                ]}
                                                onQueryChange={(key, query, name) => this.handleFieldQueryChanged('dateModified', query, name, options.updateQuery)}
                                                value={this.props.searchState.dateModified}
                                            />
                                        </Grid>
                                        <Grid item xs={3} />
                                        <Grid item xs={titleWidth}>
                                            <Typography style={titleStyles} variant="body1">Contains</Typography>
                                        </Grid>
                                        <Grid item xs={contentWidth}>
                                            <TextField
                                                fullWidth
                                                placeholder={resources.SEARCH_CONTAINS_PLACEHOLDER}
                                                fieldName={'_Text'}
                                                onQueryChange={(key, query, plainValue) => this.handleFieldQueryChanged('contains', query, plainValue, options.updateQuery)}
                                            />
                                        </Grid>
                                        <Grid item xs={3} />
                                        <Grid item xs={titleWidth}>
                                            <Typography style={titleStyles} variant="body1">{resources.SEARCH_LOCATION_BUTTON_TITLE}</Typography>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Button style={{ boxShadow: 'none' }} variant="contained" onClick={(ev) => this.handlePickLocation(ev, options)}>{this.props.selectedTypeRoot[0] ? this.props.selectedTypeRoot[0].DisplayName : resources.SEARCH_LOCATION_ANYWHERE}</Button>
                                        </Grid>
                                        <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Button style={{ boxShadow: 'none' }} type="submit" variant="contained">Search</Button>
                                        </Grid>
                                    </Grid>
                                </Popover>
                            </form>
                        } else {
                            return <IconButton style={styles.searchButton}>
                                <Icon type={iconType.materialui} iconName="search" style={{ color: '#fff' }} />
                            </IconButton>
                        }
                    }}
                </MediaQuery>
                }
            >
            </AdvancedSearch>

        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(SearchDocuments)

export { connectedComponent as SearchDocuments }
