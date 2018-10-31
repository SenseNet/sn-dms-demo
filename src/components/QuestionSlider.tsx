import * as React from 'react'

const styles = {
    container: {
        right: -270,
        transition: 'all 0.2s ease',
        position: 'fixed',
        background: '#fff',
        padding: '25px 30px 20px 31px',
        borderRadius: '10px 0 0 10px',
        top: '50%',
        margiTtop: '-79px',
        overflow: 'hidden',
        width: '195px',
        zIndex: 10,
        color: '#777',
        boxShadow: '-1px 2px 12px 0px rgba(0,0,0,0.4)',
        height: 181,
    },
    containerOpen: {
        right: 0,
    },
    closeButton: {
        width: 20,
        height: 20,
        position: 'absolute',
        top: '6px',
        left: '7px',
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiCQcNAhbJpQ5hAAAAg0lEQVQ4y62Uyw2AIBBEHyY2QGvWaQNe6ICERmzAA57UEH47iZxIZgZ2Zz+Og5WNk/nx7FwQyES8gR7JhOcykxSsuaRijCVNtC/pIm1g+HcNTrMrCSb/PpLN7leSSMaCAp5EJpNa9MXywq8hiUmLtoqFE1tDbD6xvcUBkkdUXAJOXTM3mAN4Ve+isxUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDktMDdUMTM6MDI6MjIrMDI6MDC7A589AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTA5LTA3VDEzOjAyOjIyKzAyOjAwyl4ngQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '10px',
        cursor: 'pointer',
        backgroundColor: 'white',
        border: 0,
    },
    inner: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    innerText: {
        fontSize: '18px',
        textAlign: 'center',
        lineHeight: '19px',
        margin: '21px 0 0 0',
    },
    button: {
        display: 'block',
        borderRadius: '3px',
        color: '#fff',
        lineHeight: '33px',
        height: '33px',
        textTransform: 'uppercase',
        backgroundColor: '#13a5ad',
        textAlign: 'center',
        letterSpacing: '1px',
        padding: '0 10px',
        textDecoration: 'none',
        fontSize: '13px',
    },
}

interface QuestionSliderState {
    open: boolean,
}

class QuestionSlider extends React.Component<{}, QuestionSliderState> {

    public setCookie = (cname, cvalue, exdays) => {
        const d = new Date()
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
        const expires = 'expires=' + d.toUTCString()
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
        this.setState({
            open: false,
        })
    }
    public getCookie = (cname) => {
        const name = cname + '='
        const decodedCookie = decodeURIComponent(document.cookie)
        const ca = decodedCookie.split(';')
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) === ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ''
    }
    public state: QuestionSliderState = {
        open: this.getCookie('openquestion') === null || !this.getCookie('openquestion') ? true : false,
    }
    public closeDialog = () => {
        this.setState({
            open: false,
        })
    }
    public render() {
        return (
            <div style={this.state.open ? { ...styles.container, ...styles.containerOpen } : styles.container as any}>
                <button type="button" name="button" style={styles.closeButton as any} onClick={() => this.closeDialog()}></button>
                <div style={styles.inner as any}>
                    <p style={styles.innerText as any}>Please help us by completing this survey</p>
                    <a onClick={() => this.setCookie('openquestion', 'true', 30)} href="https://www.surveymonkey.com/r/V5M25P9" target="_blank" style={styles.button as any}>Go to survey</a>
                </div>
            </div>
        )
    }
}

export default QuestionSlider
