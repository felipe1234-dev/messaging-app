import styled, { css } from "styled-components";
import { Variant, Align } from "@types";

interface StyledTitleProps {
    level: number;
    variant: Variant;
    align: Align;
    ml: number;
    mr: number;
    mt: number;
    mb: number;
    mx?: number;
    my?: number;
    pt: number;
    pl: number;
    pr: number;
    pb: number;
    px?: number;
    py?: number;
}

const StyledTitle = styled.h1<StyledTitleProps>`
    ${({
        level,
        align,
        variant,
        mt,
        ml,
        mr,
        mb,
        mx,
        my,
        pt,
        pl,
        pr,
        pb,
        px,
        py,
        theme,
    }) => css`
        font-size: ${6 / level}em;
        text-align: ${align};
        color: ${theme.text[variant]};
        margin-top: ${py ?? mt}px;
        margin-left: ${px ?? ml}px;
        margin-right: ${px ?? mr}px;
        margin-bottom: ${py ?? mb}px;
        padding-top: ${py ?? pt}px;
        padding-left: ${px ?? pl}px;
        padding-right: ${px ?? pr}px;
        padding-bottom: ${py ?? pb}px;
    `}
`;

interface TitleProps extends Partial<StyledTitleProps> {
    children: React.ReactNode;
}

function Title(props: TitleProps) {
    let {
        level = 1,
        variant = "primary",
        align = "center",
        mt = 0,
        ml = 0,
        mr = 0,
        mb = 0,
        mx,
        my,
        pt = 0,
        pl = 0,
        pr = 0,
        pb = 0,
        px,
        py,
        children,
    } = props;
    level = Math.max(Math.min(level, 6), 1);

    return (
        // @ts-ignore
        <StyledTitle
            // @ts-ignore
            as={`h${Math.round(level)}`}
            level={level}
            variant={variant}
            align={align}
            mt={mt}
            mb={mb}
            ml={ml}
            mr={mr}
            mx={mx}
            my={my}
            pt={pt}
            pb={pb}
            pl={pl}
            pr={pr}
            px={px}
            py={py}
        >
            {children}
        </StyledTitle>
    );
}

export default Title;
export type { TitleProps };
