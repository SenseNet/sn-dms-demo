import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Query } from '@sensenet/query'
import { AdvancedSearch } from '@sensenet/search-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { repository, rootStateType } from '..'
import { resources } from '../assets/resources'
import { loadParent, setChildrenOptions } from '../store/documentlibrary/actions'
import QuickSearchBox from './QuickSearchInput'

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
    parent: state.dms.documentLibrary.parent,
})

const mapDispatchToProps = {
    setChildrenOptions,
    loadParent,
}

class QuickSearch extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { style?: React.CSSProperties }, { isOpen }> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
        }
    }
    public onClick = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    private elementRef: HTMLElement | null = null
    private searchBoxContainerRef: HTMLElement | null = null

    public render() {
        return (
            <AdvancedSearch
                schema={repository.schemas.getSchema(GenericContent)}
                onQueryChanged={debounce((q) => {
                    console.log(q)
                    this.props.setChildrenOptions({
                        query: q.toString(),
                    })
                    this.props.loadParent(this.props.parent.Id)
                })}
                style={{ width: '100%' }}
                fields={(options) => <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        if (matches) {
                            return <div style={{ ...matches ? null : styles.searchContainerMobile, ...this.props.style }}>
                                <QuickSearchBox {...this.props}
                                    isOpen={matches ? this.state.isOpen : true}
                                    onClick={this.onClick}
                                    startAdornmentRef={(r) => { (this.elementRef = r) }}
                                    containerRef={(r) => this.searchBoxContainerRef = r}
                                    inputProps={{
                                        style: {
                                            width: '100%',
                                        },
                                        placeholder: resources.SEARCH_PLACEHOLDER,
                                        onChange: (ev) => {
                                            const term = ev.currentTarget.value
                                            options.updateQuery('quickSearch', new Query((q) => term ? q
                                                .equals('Name', `*${term}*`)
                                                .or
                                                .equals('DisplayName', `*${term}*`) : q,
                                            ))
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
                                        },
                                    }}
                                >
                                    <div style={{ margin: '1em' }}>
                                        <Typography variant="title">{resources.SEARCH_OPTIONS_TITLE}</Typography>
                                    </div>
                                </Popover>
                            </div>
                        } else {
                            return <IconButton style={styles.searchButton}>
                                <Icon type={iconType.materialui} iconName="search" style={{ color: '#fff' }} />
                            </IconButton>
                        }
                    }}
                </MediaQuery>}
            >
            </AdvancedSearch>

        )
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(QuickSearch)

export { connectedComponent as QuickSearch }
