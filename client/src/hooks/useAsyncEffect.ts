import { useEffect } from "react";

function useAsyncEffect(func: () => Promise<void>, dependencies: any[] = []) {
    useEffect(() => {
        func();
    }, dependencies);
}

export default useAsyncEffect;