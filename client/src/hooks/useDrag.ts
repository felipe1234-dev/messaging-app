import { useState, useRef } from "react";

function useDrag() {
    const [clicked, setClicked] = useState(false);
    const [dragging, setDragging] = useState(false);
    const position = useRef(0);

    const dragStart = (evt: React.MouseEvent) => {
        position.current = evt.clientX;
        setClicked(true);
    };

    const dragStop = () => {
        // NOTE: need some delay so item under cursor won't be clicked
        window.requestAnimationFrame(() => {
            setDragging(false);
            setClicked(false);
        });
    };

    const dragMove = (evt: React.MouseEvent, callback?: (deltaX: number) => void) => {
        const newDiff = position.current - evt.clientX;

        const movedEnough = Math.abs(newDiff) > 5;

        if (clicked && movedEnough) {
            setDragging(true);
        }

        if (dragging && movedEnough && callback) {
            position.current = evt.clientX;
            callback(newDiff);
        }
    };

    return {
        dragStart,
        dragStop,
        dragMove,
        dragging,
        position,
        setDragging
    };
}

export default useDrag;