import { useState, useEffect, useRef } from "react";
import useUnmount from "./useUnmount";

function useTimeout(
    callback: Function,
    waitTime: number | null = null,
    triggers: any[] = []
) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const [intId, setIntId] = useState<NodeJS.Timer>();

    useEffect(() => {
        if (waitTime === null) return;

        const id = setTimeout(() => {
            callbackRef.current();
        }, waitTime);

        setIntId(id);
    }, [waitTime, ...triggers]);

    useEffect(() => {
        if (waitTime === null) {
            clearInterval(intId);
        }
    }, [waitTime]);

    useUnmount(() => {
        clearInterval(intId);
    });
}

export default useTimeout;
