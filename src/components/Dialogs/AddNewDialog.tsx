import { NewView } from '@sensenet/controls-react'
import * as React from 'react'
import { repository } from '../../index'

interface AddNewDialogProps {
    parentPath: string,
    contentTypeName: string,
}

export class AddNewDialog extends React.Component<AddNewDialogProps, { schema }> {
    public render() {
        const { parentPath, contentTypeName } = this.props
        return (
            <NewView path={parentPath} repository={repository} contentTypeName={contentTypeName}/>
        )
    }
}
