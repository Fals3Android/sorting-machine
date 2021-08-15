import * as React from "react";
import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Sorter } from "./machines/Sorter";
import { Iterator } from "./machines/Iterator";

export function View() {
    const [getSorter, sendToSorter] = useMachine(Sorter);
    const [getIterator, sendToIterator] = useMachine(Iterator);
    const { left, values, swapOccured } = getIterator.context as any;
    const { input } = getSorter.context as any;
    
    return (
        <div className="numbers-sandbox">
            <h1 className="algo-type">Bubble Sort</h1>
            <input type="text" placeholder="comma separated number list" onChange={(event) => sendToSorter({ type: "START", value: event.target.value })} />
            <div className="buttons">
                <button className="sort-button"
                    onClick={() => sendToIterator({ type: "START", length: input.length, values: input })}
                >
                    Sort Input
                </button>
                <button className="reset-button"
                    onClick={() => sendToIterator({ type: "RESET" })}
                >
                    reset
                </button>
            </div>
            <div className="numbers-container">
                {values.map((num, v) => {
                    return <React.Fragment>
                        <div key={v} className={`${getClassNames(left, v, swapOccured)}`}
                        >{num}</div>
                    </React.Fragment>
                })}
            </div>
        </div>
    )
}

export const getClassNames = (left, v, swapOccured) => {
    const current = left === v;
    const next = left + 1 === v;
    return `box ${current ? "left" : ""} ${next ? "right" : ""}  ${swapOccured && current ? "jello-horizontal" : ""}`
}