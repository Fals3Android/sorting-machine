import * as React from "react";
import { useMachine } from "@xstate/react";
import { Sorter } from "./machines/Sorter";

export function View() {
    const [getSorter, sendToSorter] = useMachine(Sorter);
    const { isSorted, input } = getSorter.context as any;

    return (
        <div className="numbers-sandbox">
            <div>Is Sorted: {`${isSorted}`}</div>
            <input type="text" onChange={(event) => sendToSorter({ type: "START", value: event.target.value })} />
            <button>Sort</button>
            <div className="numbers-container">
                {input.map((num, v) => <div key={v} className="box">{num}</div>)}
            </div>
        </div>
    )
}