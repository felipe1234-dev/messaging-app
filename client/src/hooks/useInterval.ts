import { useEffect, useRef } from "react";

function useInterval(callback: Function, delay: number | null) {
	const savedCallback = useRef<Function>();

    const tick = () => {
        const func = savedCallback.current;
        if (func) func();
    };

	// Remember the last callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		if (delay !== null) {
			const id = setInterval(tick, delay);
			return () => {
				clearInterval(id);
			};
		}
	}, [delay]);
}

export default useInterval;