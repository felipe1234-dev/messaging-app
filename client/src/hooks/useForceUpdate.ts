import { useState } from "react";

function useForceUpdate() {
    const [count, setCount] = useState(0);

    const forceUpdate = () => setCount((prev) => prev + 1);

    return { count, forceUpdate };
}

export default useForceUpdate;
