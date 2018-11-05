import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'
import Search from '@material-ui/icons/Search'
import Tune from '@material-ui/icons/Tune'
import * as React from 'react'
import MediaQuery from 'react-responsive'

const styles = {
    textStyle: {
        width: 300,
        background: '#fff',
        borderRadius: 2,
        borderBottom: 0,
        boxShadow: '0px 2px 2px #3c9fbf',
    },
    openMobile: {
        width: '100%',
    },
    closed: {
        width: 0,
    },
    searchButton: {
        color: '#fff',
        verticalAlign: 'middle' as any,
    },
    icon: {
        width: 40,
        height: 40,
        padding: 5,
        top: 0,
        color: '#fff',
        verticalAlign: 'middle' as any,
    },
}

const quickSearchBox = (props: { isOpen: boolean, onClick: () => void }) => {
    return (
        <MediaQuery minDeviceWidth={700}>
            {(matches) => {
                if (matches) {
                    return <Input
                        name="search"
                        style={styles.textStyle}
                        disableUnderline={true}
                        placeholder="search"
                        startAdornment={
                            <InputAdornment position="start">
                                <IconButton disabled>
                                    <Search color="disabled" />
                                </IconButton>
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={props.onClick}>
                                    <Tune />
                                    {props.isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                } else {
                    return <Input name="search" placeholder="search" style={styles.textStyle} disableUnderline={true} />
                }
            }}

        </MediaQuery>
    )
}

export default quickSearchBox
