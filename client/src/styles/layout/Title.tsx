import styled from "styled-components";
import { Variant } from "@types";

interface StyledTitleProps {
    level: number;
    variant: Variant;
    align: "center" | "start" | "end";
    ml?: number;
    mr?: number;
    mt?: number;
    mb?: number;
    pt?: number;
    pl?: number;
    pr?: number;
    pb?: number;
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
        mt = 0,
        ml = 0,
        mr = 0,
        mb = 0,
        pt = 0,
        pl = 0,
        pr = 0,
        pb = 0,
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