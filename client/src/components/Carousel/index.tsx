import React, { useRef } from "react";

import { usePreventBodyScroll, useDrag } from "@hooks";

import { StyledCarousel, ScrollContainer } from "./styles";
import { StyledCarouselProps, ScrollContainerProps } from "./styles";

interface CarouselProps extends Partial<StyledCarouselProps>, Partial<ScrollContainerProps> {
    draggable?: boolean;
    scrollWithWheel?: boolean;
    step?: number;
    width: string;
    height: string;
    children: React.ReactNode;
}

function Carousel(props: CarouselProps) {
    const {
        draggable = true,
        scrollWithWheel = true,
        hideScrollbar = true,
        direction = "row",
        align = "center",
        justify = "center",
        gap = 10,
        step = 100,
        width,
        height = "fit-content",
        p,
        pl, pr,
        pt, pb,
        px, py,
        children
    } = props;

    const {
        disableScroll,
        enableScroll
    } = usePreventBodyScroll();

    const {
        dragStart,
        dragStop,
        dragMove
    } = useDrag();

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollContainer = scrollContainerRef.current;

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

    const handleMouseDown = (evt: React.WheelEvent<HTMLDivElement>) => {
        if (draggable) dragStart(evt);
    };

    const handleMouseUp = () => {
        if (draggable) dragStop();
    };

    const handleMouseMove = (evt: React.MouseEvent<HTMLDivElement>) => {
        if (draggable) {
            dragMove(evt, (posDiff) => {
                if (scrollContainer) {
                    scrollContainer.scrollLeft += posDiff;
                }
            });
        }
    };

    const handleOnWheel = (evt: React.WheelEvent<HTMLDivElement>) => {
        if (!scrollWithWheel) return;

        const isThouchpad = Math.abs(evt.deltaX) !== 0 || Math.abs(evt.deltaY) < 15;

        if (isThouchpad) {
            evt.stopPropagation();
            return;
        }

        if (!scrollContainer) return;

        const scrollAmount = evt.deltaY / Math.abs(evt.deltaY) * step;

        const deltaLeft = direction === "row" ? scrollAmount : 0;
        const deltaTop = direction === "row" ? 0 : scrollAmount;

        const initLeft = scrollContainer.scrollLeft;
        const initTop = scrollContainer.scrollTop;

        scrollContainer.scroll({
            left: initLeft + deltaLeft,
            top: initTop + deltaTop,
            behavior: "smooth"
        });
    };

    return (
        <StyledCarousel
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            width={width}
            height={height}
            pl={pl} pr={pr}
            pt={pt} pb={pb}
            px={px} py={py}
            p={p}
        >
            <ScrollContainer
                ref={scrollContainerRef}
                hideScrollbar={hideScrollbar}
                onWheel={handleOnWheel}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                direction={direction}
                align={align}
                justify={justify}
                gap={gap}
            >
                {children}
            </ScrollContainer>
        </StyledCarousel>
    );
}

export default Carousel;
export type { CarouselProps };