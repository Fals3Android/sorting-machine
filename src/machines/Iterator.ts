import { createMachine, assign } from "xstate";
export const isPointerAtEnd = (context) => context.pointer === context.input.length - 1;
export const isSorted = (context, event: any) => !event.isSorted;
export const setInput = assign((context, event: any) => ({ input: event.value }));
export const setPointer = assign((context: any) => ({ pointer: context.pointer + 1 }));
export const resetContext = assign((context: any) => ({ input: [], pointer: 0 }));

export const Iterator = createMachine(
    {
        id: "iterator",
        initial: "idle",
        context: {
            input: [],
            pointer: 0
        },
        states: {
            idle: {
                on: {
                    START: { target: "active", cond: isSorted, actions: "setInput" }
                }
            },
            active: {
                after: {
                    1000: [
                        { target: "idle", cond: "isPointerAtEnd", actions: "resetContext" },
                        { target: "active", actions: "setPointer", }
                    ]
                }
            }
        }
    },
    {
        guards: {
            isPointerAtEnd,
            isSorted
        },
        actions: {
            setInput,
            setPointer,
            resetContext
        }
    }
);