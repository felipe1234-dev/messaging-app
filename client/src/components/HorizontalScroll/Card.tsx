import { useContext } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

interface CardProps {
    id: string;
    Component: (props: CardComponentProps) => JSX.Element;
    index: number;
    selected: boolean;
    onClick: () => void;
}

interface CardComponentProps extends Omit<CardProps, "Component" | "onClick"> {
    visible: boolean;
}
 

function Card(props: CardProps) {
    const { id, index, Component, onClick, ...rest } = props;
    const { isItemVisible } = useContext(VisibilityContext);
    const isVisible = isItemVisible(id);

    return (
        <div
            data-id={id}
            data-visible={isVisible}
            data-index={index}
            onClick={onClick}
        >
            <Component 
                id={id}
                index={index}
                visible={isVisible} 
                {...rest} 
            />
        </div>
    );
}

export default Card;
export type { CardProps, CardComponentProps };