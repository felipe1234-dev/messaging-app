import { useState } from "react";
import { Container, ContainerProps } from "@styles/layout";
import { Button, ButtonProps } from "@components";
import { TabButtons, Indicator, IndicatorProps } from "./styles";

interface Tab {
    id: string;
    label?: string;
    button?: Partial<ButtonProps>;
    content?: React.ReactNode;
}

interface TabsProps extends Partial<ContainerProps> {
    active: string;
    tabs: Tab[];
    onSelect: (newTab: Tab) => void | Promise<void>;
    indicator?: Partial<IndicatorProps>;
}

function Tabs(props: TabsProps) {
    const {
        active,
        tabs,
        onSelect,
        indicator = {},
        direction = "row",
        justify = "start",
        align = "center",
        gap = 0,
        ...restTabButtons
    } = props;

    const {
        variant = "primary",
        offset = 0,
        margin = 0,
        thickness = 2,
        position = "center-left",
        borderRadius = 0
    } = indicator;

    const [selectedButton, setSelectedButton] = useState<HTMLButtonElement | null>(null);
    const activeTab = tabs.find(tab => tab.id === active);

    return (
        <Container transparent>
            <TabButtons
                direction={direction}
                justify={justify}
                align={align}
                gap={gap}
                {...restTabButtons}
            >
                {tabs.map(tab => {
                    const {
                        transparent = true,
                        variant = "primary",
                        children,
                        ...restButton
                    } = tab.button || {};

                    return (
                        <Button
                            key={tab.id}
                            ref={tab.id === active ? (el) => setSelectedButton(el) : undefined}
                            onClick={() => onSelect(tab)}
                            transparent={transparent}
                            variant={variant}
                            {...restButton}
                        >
                            {tab.label || children}
                        </Button>
                    );
                })}
                {selectedButton && (
                    <Indicator
                        variant={variant}
                        selectedButton={selectedButton}
                        margin={margin}
                        offset={offset}
                        thickness={thickness}
                        position={position}
                        borderRadius={borderRadius}
                    />
                )}
            </TabButtons>
            {activeTab && activeTab.content}
        </Container>
    );
}

export default Tabs;
export type { TabsProps };