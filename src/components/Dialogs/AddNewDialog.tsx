import { DialogContent, DialogTitle } from '@material-ui/core'
import { NewView } from '@sensenet/controls-react'
import * as React from 'react'

import { resources } from '../../assets/resources'

interface AddNewDialogProps {
    parentPath: string,
    repository,
    schema,
}

export class AddNewDialog extends React.Component<AddNewDialogProps, {}> {
    public render() {
        const { parentPath } = this.props
        return (
            <NewView path={parentPath} repository={this.props.repository} schema={this.props.schema} />
        )
    }
}
