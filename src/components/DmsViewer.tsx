import { MuiThemeProvider } from '@material-ui/core'
import { DocumentTitlePager, DocumentViewer, Download, exampleTheme, LayoutAppBar, Print, RotateActivePages, SearchBar, Share, ToggleThumbnailsWidget, ZoomInOutWidget } from '@sensenet/document-viewer-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '..'
import { closeViewer } from '../Actions'

const mapStateToProps = (state: rootStateType) => ({
    isOpened: state.dms.viewer.isOpened,
    hostName: state.sensenet.session.repository.repositoryUrl,
    idOrPath: state.dms.viewer.currentDocumentId,
})

export const mapDispatchToProps = {
    closeViewer,
}

// tslint:disable-next-line:no-empty-interface
export interface DmsViewerProps {
    /**/
}

export interface DmsViewerState {
    isOpened: boolean
}

export class DmsViewerComponent extends React.Component<DmsViewerProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DmsViewerState> {

    public state = { isOpened: false }

    public static getDerivedStateFromProps(newProps: DmsViewerComponent['props'], lastState: DmsViewerComponent['state']) {
        return {
            ...lastState,
            isOpened: newProps.isOpened,
        }
    }

    public keyboardHandler(event: KeyboardEvent) {
        if (event.key === 'Escape') {
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
                    onClick={() => this.props.closeViewer}
                >
                    <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(238,238,238,.8)', filter: 'blur(5px)', backdropFilter: 'blur(5px)' }} />
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <MuiThemeProvider theme={exampleTheme}>
                            <DocumentViewer
                                documentIdOrPath={this.props.idOrPath}
                                hostName={this.props.hostName}>
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
                            </DocumentViewer>
                        </MuiThemeProvider>
                    </div>
                </div>)
        }
        return null
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DmsViewerComponent)
export { connectedComponent as DmsViewer }
