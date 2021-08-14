import * as React from "react";
import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Sorter } from "./machines/Sorter";
import { Iterator } from "./machines/Iterator";

export function View() {
    const [getSorter, sendToSorter] = useMachine(Sorter);
    const [getIterator, sendToIterator] = useMachine(Iterator);
    const { left, values } = getIterator.context as any;
    const { input } = getSorter.context as any;

    return (
        <div className="numbers-sandbox">
            <p>Bubble Sort</p>
            <input type="text" onChange={(event) => sendToSorter({ type: "START", value: event.target.value })} />
            <button className="sort-button"
                onClick={() => sendToIterator({ type: "START", length: input.length, values: input})}
            >
                Sort Input
            </button>
            <div>{left}</div>
            <div className="numbers-container">
                {values.map((num, v) => <div key={v} className={`box ${left + 1 == v ? "right" : ""}  ${left == v ? "left" : ""}`} >{num}</div>)}
            </div>
        </div>
    )
}