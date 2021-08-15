import { createMachine, assign } from "xstate";
export const isLeftAtEnd = (context) => context.left >= context.inputLength - 1;
export const isSorted = (context) => !context.isSorted;
export const isGreaterThan = (context: any) => context.values[context.left] > context.values[context.left + 1] && context.left >= context.right;
export const wasSwapNotCalled = (context: any) => context.swapCalls === 0 && context.left >= context.values.length - 1;
export const setInput = assign((context, event: any) => ({ inputLength: event.length, values: event.values, swapOccured: event.values[0] > event.values[1] }));
export const setLeft = assign((context: any) => ({ left: context.left + 1 }));
export const resetLeftPointer = assign((context: any) => ({ left: 0, swapCalls: 0 }));
export const resetContext = assign((context: any) => ({
    isSorted: false,
    values: [],
    inputLength: 0,
    left: 0,
    swapCalls: 0,
    swapOccured: false
 }));
export const swap = assign((context: any) => {
    let newInput = [...context.values];
    if(newInput[context.left] > newInput[context.left + 1]) {
        let temp = newInput[context.left];
        newInput[context.left] = newInput[context.left + 1];
        newInput[context.left + 1] = temp;
        return {
            swapCalls: context.swapCalls + 1,
            values: newInput
        }
    }
    return {
        values: newInput
    }
});

export const willSwapOccur = assign((context: any) => {
    if(context.values[context.left] > context.values[context.left + 1]) {
        return {
            swapOccured: true
        }
    }
    return {
        swapOccured: false
    }
});

export const setIsSorted = assign((context: any) => ({isSorted: true}));


export const Iterator = createMachine(
    {
        id: "iterator",
        initial: "idle",
        context: {
            isSorted: false,
            values: [],
            inputLength: 0,
            left: 0,
            swapCalls: 0,
            swapOccured: false
        },
        states: {
            idle: {
                on: {
                    START: { target: "leftActive", cond: "isSorted", actions: "setInput" },
                    RESET: { actions: "resetContext" }
                }
            },
            leftActive: {
                after: {
                    1000: [
                        { target: "idle", cond: "wasSwapNotCalled", actions: "setIsSorted"},
                        { target: "leftActive", cond: "isLeftAtEnd", actions: "resetLeftPointer" },
                        { target: "swapActive", actions: "willSwapOccur"}
                    ]
                }
            },
            swapActive: {
                after: {
                    800: [
                        { target: "leftActive", actions: ["swap", "setLeft"] }
                    ]
                }
            }
        }
    },
    {
        guards: {
            isLeftAtEnd,
            isSorted,
            wasSwapNotCalled,
            isGreaterThan
        },
        actions: {
            setInput,
            setLeft,
            resetContext,
            resetLeftPointer,
            swap,
            setIsSorted,
            willSwapOccur
        }
    }
);