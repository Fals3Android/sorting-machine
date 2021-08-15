import { createMachine, assign } from "xstate";

const isSorted = (context, event) => {
    if (!context.input.length) {
        return false;
    }
    let copy = [...context.input];
    return copy.sort((a, b) => a - b).join("") === context.input.join("");
}

const containsOnlyNumbers = (context, event) => {
    let regex = /^\d+(,\d+)*$/g;
    return event.value.match(regex);
}

const setInput = assign((context, event: any) => {
    const { value } = event;
    console.log(value);
    const result = value.split(",").map(k => parseInt(k));
    return {
        input: result,
        message: "Input Updated"
    }
});

const resetInput = assign((context, event: any) => {
    return {
        input: "",
        message: "Input Updated"
    }
});

export const Sorter = createMachine(
    {
        id: "sorter",
        initial: "idle",
        context: {
            input: [],
            isSorted: false
        },
        states: {
            idle: {
                on: {
                    START: { target: "active", cond: "containsOnlyNumbers", actions: "setInput" },
                    RESET: { actions: "resetInput" }
                }
            },
            active: {
                on: {
                    "": [
                        { target: "idle", cond: "isSorted", actions: assign({isSorted: true}) },
                        { target: "idle", actions: assign({isSorted: false}) }
                    ]
                }
            }
        }
    },
    {
        actions: {
            setInput,
            resetInput
        },
        guards: {
            containsOnlyNumbers,
            isSorted
        }
    }
);