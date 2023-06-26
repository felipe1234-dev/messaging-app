import { useEffect, useRef } from "react";

function useInterval(
    callback: (timerId: NodeJS.Timer) => void,
    delay: number | null,
    dependencies: any[] = []
) {
    const savedCallback = useRef<Function>();

    const tick = (timerId: NodeJS.Timer) => {
        const func = savedCallback.current;
        if (func) func(timerId);
    };

    // Remember the last callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        if (delay !== null) {
            const timerId = setInterval(() => {
                tick(timerId);
            }, delay);

            return () => {
                clearInterval(timerId);
            };
        }
    }, [delay, ...dependencies]);
}

export default useInterval;
