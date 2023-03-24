import { useState, useEffect } from "react";
import { ScrollMenu, Props as ScrollMenuProps } from "react-horizontal-scrolling-menu";

import { classNames } from "@functions";
import { usePreventBodyScroll, useDrag } from "@hooks";

import { StyledHorizontalScroll } from "./styles";
import Card, { CardComponentProps, CardProps } from "./Card";
import Arrow, { ArrowComponentProps, ArrowProps } from "./Arrow";

interface HorizontalScrollProps extends Omit<ScrollMenuProps, "children" | "RightArrow" | "LeftArrow"> {
    className?: string;
    hideScrollbar?: boolean;
    scrollWithWheel?: boolean;
    selectable?: boolean;
    draggable?: boolean;
    multiple?: boolean;
    loopScroll?: boolean;
    items: {
        id: string;
        Component: () => JSX.Element
    }[];
    RightArrow?: ArrowProps["Component"];
    LeftArrow?: ArrowProps["Component"];
}

function HorizontalScroll(props: HorizontalScrollProps) {
    const {
        className = "",
        scrollWithWheel = true,
        hideScrollbar = true,
        draggable = true,
        selectable = false,
        multiple = false,
        loopScroll = false,
        items,
        LeftArrow,
        RightArrow,
        ...rest
    } = props;

    const [selected, setSelected] = useState<string[]>([]);

    const {
        disableScroll,
        enableScroll
    } = usePreventBodyScroll();

    const {
        dragStart,
        dragStop,
        dragMove,
        dragging
    } = useDrag();

    const handleOnMouseEnter = () => {
        if (scrollWithWheel) {
            disableScroll();
        }
    };

    const handleOnMouseLeave = () => {
        if (scrollWithWheel) {
            enableScroll();
        }

        if (draggable) {
            dragStop();
        }
    };

    const handleOnWheel: ScrollMenuProps["onWheel"] = (apiObj, evt) => {
        if (!scrollWithWheel) return;

        const isThouchpad = Math.abs(evt.deltaX) !== 0 || Math.abs(evt.deltaY) < 15;

        if (isThouchpad) {
            evt.stopPropagation();
            return;
        }

        if (evt.deltaY < 0) {
            apiObj.scrollNext();
        } else if (evt.deltaY > 0) {
            apiObj.scrollPrev();
        }
    };

    const handleMouseDown: ScrollMenuProps["onMouseDown"] = (api) => (evt) => {
        if (draggable) dragStart(evt);
    };

    const handleMouseUp = () => () => {
        if (draggable) dragStop();
    };

    const handleMouseMove: ScrollMenuProps["onMouseMove"] = ({ scrollContainer }) => (evt) => {
        if (draggable) {
            dragMove(evt, (posDiff) => {
                if (scrollContainer.current) {
                    scrollContainer.current.scrollLeft += posDiff;
                }
            });
        }
    };

    const isItemSelected = (itemId: string) => {
        return selected.includes(itemId);
    };

    const handleClick = (itemId: string) => () => {
        if (!selectable) return;
        if (dragging) return;

        const isSelected = isItemSelected(itemId);

        if (multiple) {
            if (isSelected) setSelected(prev => prev.filter(id => id !== itemId));
            else setSelected(prev => [...prev, itemId]);
        } else {
            if (isSelected) setSelected([]);
            else setSelected([itemId]);
        }
    };

    useEffect(() => {
        if (!multiple) setSelected([]);
    }, [multiple]);

    return (
        <StyledHorizontalScroll
            className={classNames({ [className]: !!className })}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            hideScrollbar={hideScrollbar}
        >
            <ScrollMenu
                onWheel={handleOnWheel}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                LeftArrow={LeftArrow && (
                    <Arrow
                        side="left"
                        loopScroll={loopScroll}
                        Component={LeftArrow}
                    />
                )}
                RightArrow={RightArrow && (
                    <Arrow
                        side="right"
                        loopScroll={loopScroll}
                        Component={RightArrow}
                    />
                )}
                {...rest}
            >
                {items.map((item, i) => (
                    <Card
                        key={item.id}
                        index={i}
                        onClick={handleClick(item.id)}
                        selected={isItemSelected(item.id)}
                        {...item}
                    />
                ))}
            </ScrollMenu>
        </StyledHorizontalScroll>
    );
}

export default HorizontalScroll;
export type { HorizontalScrollProps, ArrowProps, ArrowComponentProps, CardProps, CardComponentProps }