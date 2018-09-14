import { MuiThemeProvider, Typography } from '@material-ui/core'
import { DocumentTitlePager, DocumentViewer, Download, exampleTheme, LayoutAppBar, pollDocumentData, Print, RotateActivePages, SearchBar, Share, ToggleThumbnailsWidget, ZoomInOutWidget } from '@sensenet/document-viewer-react'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '..'
import { closeViewer, openViewer } from '../Actions'
import { theme } from '../assets/theme'
// tslint:disable-next-line:no-var-requires
const loaderImage = require('../assets/viewer-loader.gif')

const mapStateToProps = (state: rootStateType) => ({
    isOpened: state.dms.viewer.isOpened,
    hostName: state.sensenet.session.repository.repositoryUrl,
    idOrPath: state.dms.viewer.currentDocumentId,
    documentName: state.sensenetDocumentViewer.documentState.document.documentName,
})

export const mapDispatchToProps = {
    closeViewer,
    openViewer,
    pollDocumentData,
}

// tslint:disable-next-line:no-empty-interface
export interface DmsViewerProps extends RouteComponentProps<any> {
    /**/
}

export interface DmsViewerState {
    isOpened: boolean
}

export class DmsViewerComponent extends React.Component<DmsViewerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DmsViewerState> {

    public state = { isOpened: false }

    public static getDerivedStateFromProps(newProps: DmsViewerComponent['props'], lastState: DmsViewerComponent['state']) {
        try {
            const openedDocumentId = parseInt(newProps.match.params.documentId && atob(decodeURIComponent(newProps.match.params.documentId)), 10)
            if (openedDocumentId) {

                if (!newProps.isOpened) {
                    newProps.openViewer(openedDocumentId)
                }
                if (newProps.idOrPath !== openedDocumentId) {
                    newProps.pollDocumentData(newProps.hostName, openedDocumentId)
                }
            }
        } catch (error) {
            /** Cannot parse current folder from URL */
            const newPath = compile(newProps.match.path)({ prefix: newProps.match.params.prefix })
            newProps.history.push(newPath)
        }
        return {
            ...lastState,
            isOpened: newProps.isOpened,
        }
    }

    public keyboardHandler(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            const previewIndex = this.props.location.pathname.indexOf('/preview/')
            if (previewIndex !== -1) {
                this.props.history.push(this.props.location.pathname.substring(0, previewIndex))
            }
            this.props.closeViewer()
        }
    }

    constructor(props: DmsViewerComponent['props']) {
        super(props)
        this.keyboardHandler = this.keyboardHandler.bind(this)

    }

    public componentDidMount() {
        document.addEventListener('keydown', this.keyboardHandler, false)
    }
    public componentWillUnmount() {
        document.removeEventListener('keydown', this.keyboardHandler, false)
    }

    public render() {
        if (this.props.isOpened) {
            return (
                <div style={{
                    position: 'fixed',
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    overflow: 'hidden',
                    zIndex: 9999,
                }}
                >
                    <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(238,238,238,.8)', filter: 'blur(5px)', backdropFilter: 'blur(5px)' }} />
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <MuiThemeProvider theme={exampleTheme}>
                            <DocumentViewer
                                documentIdOrPath={this.props.idOrPath}
                                hostName={this.props.hostName}
                                loaderImage={loaderImage}
                            >
                                    <MediaQuery minDeviceWidth={700}>
                                    {(matches) => matches ? (<div>
                                        <LayoutAppBar>
                                            <div style={{ flexShrink: 0 }}>
                                            <ToggleThumbnailsWidget />
                                            <Download download={(doc) => {
                                                // tslint:disable-next-line:no-console
                                                console.log('Download triggered', doc)
                                            }} />
                                            <Print print={(doc) => {
                                                // tslint:disable-next-line:no-console
                                                console.log('Print triggered', doc)
                                            }} />
                                            <Share share={(doc) => {
                                                // tslint:disable-next-line:no-console
                                                console.log('Share triggered', doc)
                                            }} />
                                            <ZoomInOutWidget />
                                            <RotateActivePages />
                                        </div>
                                        <DocumentTitlePager />
                                        <div style={{ flexShrink: 0 }}>
                                            <SearchBar />
                                        </div>
                                        </LayoutAppBar>
                                    </div>) : <div>
                                    <LayoutAppBar>
                                        <Typography variant="title" color="inherit">{this.props.documentName}</Typography>
                                        <div>
                                        <Share share={(doc) => {
                                                // tslint:disable-next-line:no-console
                                                console.log('Share triggered', doc)
                                            }} />
                                        </div>
                                    </LayoutAppBar>
                                    </div>
                                    }
                                    </MediaQuery>
                            </DocumentViewer>
                        </MuiThemeProvider>
                    </div>
                </div>)
        }
        return null
    }
}

const connectedComponent = withRouter(connect(mapStateToProps, mapDispatchToProps)(DmsViewerComponent))
export { connectedComponent as DmsViewer }
