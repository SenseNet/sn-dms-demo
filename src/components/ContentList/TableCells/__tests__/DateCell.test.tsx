import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DateCell } from '../DateCell'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<DateCell date="2018-08-13T13:23:12Z" />, div)
})
