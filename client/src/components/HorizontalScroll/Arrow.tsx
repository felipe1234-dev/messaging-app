import { useContext } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

interface ArrowProps {
    loopScroll?: boolean;
    side: "left" | "right";
    Component: (props: ArrowComponentProps) => JSX.Element
}

interface ArrowComponentProps extends Omit<ArrowProps, "Component"> {
    disabled: boolean;
}

function Arrow(props: ArrowProps) {
    const { Component, loopScroll = false, side, ...rest } = props;

    const {
        isFirstItemVisible,
        isLastItemVisible,
        scrollPrev,
        scrollNext,
        initComplete,
        items,
        scrollToItem
    } = useContext(VisibilityContext);

    let disabled = true;

    if (side === "left") {
        disabled = initComplete && isFirstItemVisible && !loopScroll;
    } else if (side === "right") {
        disabled = initComplete && isLastItemVisible && !loopScroll;
    }

    const itemsArr = items.toArr();
    const [, firstItem] = itemsArr[0] || [];
    const [, lastItem] = itemsArr.at(-1) || [];

    const handleClick = () => {
        if (disabled) return;

        if (side === "left") {
            if (loopScroll && isFirstItemVisible && lastItem) {
                scrollToItem(lastItem);
            } else {
                scrollPrev();
            }
        } else if (side === "right") {
            if (loopScroll && isLastItemVisible && firstItem) {
                scrollToItem(firstItem);
            } else {
                scrollNext();
            }
        }
    };

    return (
        <div data-side={side} data-disabled={disabled} onClick={handleClick}>
            <Component 
                side={side}
                loopScroll={loopScroll} 
                disabled={disabled} 
                {...rest} 
            />
        </div>
    );
}

export default Arrow;
export type { ArrowProps, ArrowComponentProps };