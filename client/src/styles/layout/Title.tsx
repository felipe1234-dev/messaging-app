import styled from "styled-components";
import { Variant } from "@types";

interface StyledTitleProps {
    level: number;
    variant: Variant;
    align: "center" | "start" | "end";  
}

const StyledTitle = styled.h1<StyledTitleProps>`
    font-size: ${props => 6/props.level}em;
    text-align: ${props => props.align};
    color: ${props => props.theme.text[props.variant]};
`;

interface TitleProps extends Partial<StyledTitleProps> {
    children: React.ReactNode;
}

function Title(props: TitleProps) {
    const { 
        level = 1,
        variant = "primary",
        align = "center",
        children 
    } = props;
    
    return (
        // @ts-ignore
        <StyledTitle 
            // @ts-ignore
            as={`h${level}`} 
            level={level}
            variant={variant}
            align={align}
        >
            {children}
        </StyledTitle>
    );
}

export default Title;
export type { TitleProps };