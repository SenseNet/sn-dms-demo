import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { File as SnFile, Folder, GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Query } from '@sensenet/query'
import { AdvancedSearch, PresetField, TextField } from '@sensenet/search-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { repository, rootStateType } from '../..'
import { resources } from '../../assets/resources'
import { loadParent, setChildrenOptions, updateSearchValues } from '../../store/documentlibrary/actions'
import { DocumentLibraryState } from '../../store/documentlibrary/reducers'
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
    query: state.dms.documentLibrary.childrenOptions.query,
    parent: state.dms.documentLibrary.parent,
    searchState: state.dms.documentLibrary.searchState,
})

const mapDispatchToProps = {
    setChildrenOptions,
    loadParent,
    updateSearchValues,
}

class SearchDocuments extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { style?: React.CSSProperties }, { isOpen: boolean, query: string }> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            query: this.props.query,
        }
        this.handleOnSubmit = this.handleOnSubmit.bind(this)
        this.handleQueryChanged = this.handleQueryChanged.bind(this)
        this.handleFieldQueryChanged = this.handleFieldQueryChanged.bind(this)
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
                        .inTree(this.props.parent.Path)
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
                query: this.state.query.toString(),
            })
            this.props.loadParent(this.props.parent.Id)
            this.setState({ isOpen: false })
        }
    }

    private elementRef: HTMLElement | null = null
    private searchBoxContainerRef: HTMLElement | null = null

    public render() {
        const titleWidth = 2
        const contentWidth = 9
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
                                    onBackdropClick={() => this.setState({ isOpen: false })}
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
                                        <Grid item xs={titleWidth}>
                                            <Typography style={titleStyles} variant="body1">Type</Typography>
                                        </Grid>
                                        <Grid item xs={contentWidth}>
                                            <PresetField fullWidth fieldName="Type"
                                                defaultValue={this.props.searchState.type || 'Any'}
                                                presets={[
                                                    { text: 'Any', value: new Query((q) => q) },
                                                    { text: 'Document', value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'word')) },
                                                    { text: 'Sheet', value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'excel')) },
                                                    { text: 'Text', value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'document')) },
                                                    { text: 'Slide', value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'word')) },
                                                    { text: 'Folder', value: new Query((q) => q.typeIs(Folder)) },
                                                ]}
                                                onQueryChange={(key, query, name) => this.handleFieldQueryChanged('type', query, name, options.updateQuery)}
                                            />
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
                                            />
                                        </Grid>
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
                                            />
                                        </Grid>
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
                                        <Grid item xs={titleWidth}>
                                            <Typography style={titleStyles} variant="body1">Location</Typography>
                                        </Grid>
                                        <Grid item xs={7}>
                                            Location buttonka
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button type="submit">Search</Button>
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
