import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { Icon, iconType } from '@sensenet/icons-react'
import * as React from 'react'
import MediaQuery from 'react-responsive'
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

export class QuickSearch extends React.Component<{ style?: React.CSSProperties }, { isOpen }> {
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
            <MediaQuery minDeviceWidth={700}>
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
                                <Typography variant="title">Alma</Typography>
                            </Popover>
                        </div>
                    } else {
                        return <IconButton style={styles.searchButton}>
                            <Icon type={iconType.materialui} iconName="search" style={{ color: '#fff' }} />
                        </IconButton>
                    }
                }}
            </MediaQuery>
        )
    }
}
