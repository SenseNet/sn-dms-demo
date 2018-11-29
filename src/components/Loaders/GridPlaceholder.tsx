import * as React from 'react'
import '../../assets/css/animated-background.css'

export const GridPlaceholder = (props: { rows?: number, columns?: number, style?: React.CSSProperties, columnStyle?: React.CSSProperties, rowStyle?: React.CSSProperties }) => {

    return (<div style={props.style}>
        {
            (Array.apply(null, { length: props.columns || 10 }).map(Number.call, Number) as number[])
                .map((c) => <div key={c} className="column" style={{ display: 'flex', ...props.columnStyle }}>
                    {
                        (Array.apply(null, { length: props.rows || 5 }).map(Number.call, Number) as number[])
                            .map((r) =>
                                <div
                                    key={r}
                                    className="row animated-background"
                                    style={{
                                        height: '48px',
                                        flexGrow: 1,
                                        margin: '.5em',
                                        ...props.rowStyle,
                                    }}
                                ></div>,
                            )
                    }
                </div>)

        }
    </div >)
}
