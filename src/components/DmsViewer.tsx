import { DocumentTitlePager, DocumentViewer, DocumentViewerSettings, Download, exampleTheme, LayoutAppBar, Print, RotateActivePages, SearchBar, Share, ToggleThumbnailsWidget, ZoomInOutWidget } from '@sensenet/document-viewer-react'
import * as React from 'react'
import { connect } from 'react-redux'
import { MuiThemeProvider } from '../../node_modules/@material-ui/core'
import { closeViewer } from '../Actions'

export interface DmsViewerProps {
    idOrPath: string | number
    isOpened: boolean
    settings: DocumentViewerSettings
    closeViewer: () => void
    hostName: string
}

export interface DmsViewerState {
    isOpened: boolean
}

export class DmsViewerComponent extends React.Component<DmsViewerProps, DmsViewerState> {

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

    constructor(props) {
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
                    backgroundColor: 'rgba(238,238,238,.8)',
                    zIndex: 9999,
                }}
                    onClick={() => this.props.closeViewer}
                >
                    <MuiThemeProvider theme={exampleTheme}>                    <DocumentViewer
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
                </div>)
        }
        return null
    }
}

const mapStateToProps = (state) => ({
    isOpened: state.dms.viewer.isOpened,
    hostName: state.sensenet.session.repository.repositoryUrl,
})

export const mapDispatchToProps = {
    closeViewer,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DmsViewerComponent)
export { connectedComponent as DmsViewer }
