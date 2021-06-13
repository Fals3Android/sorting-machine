import * as React from "react";
import { useMachine } from "@xstate/react";
import { Sorter } from "./machines/Sorter";
import { Iterator } from "./machines/Iterator";

export function View() {
    const [getSorter, sendToSorter] = useMachine(Sorter);
    const [getIterator, sendToIterator] = useMachine(Iterator);
    const { pointer } = getIterator.context as any;
    const { isSorted, input } = getSorter.context as any;

    return (
        <div className="numbers-sandbox">
            <div>Is Sorted: {`${isSorted}`}</div>
            <input type="text" onChange={(event) => sendToSorter({ type: "START", value: event.target.value })} />
            {!isSorted ? <button className="sort-button"
                onClick={() => sendToIterator({ type: "START", value: input, isSorted })}
            >
                Sort Input
            </button> : null}
            <div>{pointer}</div>
            <div className="numbers-container">
                {input.map((num, v) => <div key={v} className={`box ${pointer == v ? "active" : ""}`} >{num}</div>)}
            </div>
        </div>
    )
}