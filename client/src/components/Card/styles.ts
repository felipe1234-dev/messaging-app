import styled from "styled-components";
import { Container, ContainerProps } from "@styles/layout";

interface StyledCardProps extends ContainerProps {
    
}

const StyledCard = styled(Container)<StyledCardProps>`
    height: fit-content;
    min-height: 40px; 
`;

const CardImage = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: fit-content;
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const CardInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export { StyledCard, CardImage, CardContent, CardInfo };