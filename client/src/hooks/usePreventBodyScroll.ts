import { useState, useEffect } from "react";
import { useUnmount } from "@hooks";

const preventDefault = (ev: WheelEvent) => {
    if (ev.preventDefault) {
        ev.preventDefault();
    }
    ev.returnValue = false;
};

const enableBodyScroll = () => {
    document.removeEventListener("wheel", preventDefault, false);
};

const disableBodyScroll = () => {
    document.addEventListener("wheel", preventDefault, {
        passive: false,
    });
};

function usePreventBodyScroll() {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (hidden) disableBodyScroll();
        else enableBodyScroll();
    }, [hidden]);

    useUnmount(enableBodyScroll);

    const disableScroll = () => setHidden(true);
    const enableScroll = () => setHidden(false);

    return { disableScroll, enableScroll };
}

export default usePreventBodyScroll;
