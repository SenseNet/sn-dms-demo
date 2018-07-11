import { Button } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import * as React from 'react'
import { resources } from '../../assets/resources'

export class AddNewButton extends React.Component<{ contentType }, {}> {
    public handleButtonClick(e) {
        // TODO
    }
    public render() {
        return (
            <Button
                variant="contained"
                component="span"
                color="secondary"
                style={{
                    color: '#fff',
                    width: '100%',
                    fontFamily: 'Raleway Bold',
                    textTransform: 'none',
                    fontSize: '14px',
                    padding: '6px 10px',
                    letterSpacing: 1,
                    margin: '10px 0',
                }}
                onClick={(ev) => this.handleButtonClick(ev)}>
                <Add style={{ fontSize: 20, marginRight: 5 }} />
                {this.props.contentType ? resources.ADD_NEW + ' ' + resources[this.props.contentType.toUpperCase()] : resources.ADD_NEW}
            </Button>
        )
    }
}
