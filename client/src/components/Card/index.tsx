import { StyledCard, CardImage, CardContent, CardInfo } from "./styles";
import { Title, Paragraph } from "@styles/layout";
import { ContainerProps, TitleProps, ParagraphProps } from "@styles/layout";

interface CardProps extends ContainerProps, TitleProps, ParagraphProps {
    image: React.ReactNode;
    primary: React.ReactNode;
    secondary: React.ReactNode;
    info: React.ReactNode;
}

function ChatCard(props: CardProps) {
    const {
        direction = "row",
        justify = "space-between",
        align = "center",
        gap = 10,

        level,
        variant,
        size,

        ml,
        mr,
        mt,
        mb,
        pl,
        pr,
        pt,
        pb,

        image,
        primary,
        secondary,
        info,
    } = props;

    const spacingProps = {
        ml,
        mr,
        mt,
        mb,
        pl,
        pr,
        pt,
        pb,
    };

    return (
        <StyledCard
            direction={direction}
            justify={justify}
            align={align}
            gap={gap}
            {...spacingProps}
        >
            <CardImage>{image}</CardImage>
            <CardContent>
                <Title
                    level={level}
                    variant={variant}
                    {...spacingProps}
                >
                    {primary}
                </Title>
                <Paragraph
                    size={size}
                    variant={variant}
                    {...spacingProps}
                >
                    {secondary}
                </Paragraph>
            </CardContent>
            <CardInfo>{info}</CardInfo>
        </StyledCard>
    );
}

export default ChatCard;
export type { CardProps };
