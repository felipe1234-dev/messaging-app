import { ReactNode } from "react";
import { Title, Paragraph, Container } from "@styles/layout";
import { NotificationContainer, Snackbar } from "./styles";

interface NotificationProps {
    show: boolean;
    autoHideTime: number;
    image: ReactNode;
    title: ReactNode;
    subtitle: ReactNode;
}

function Notification(props: NotificationProps) {
    const { show, autoHideTime, image, title, subtitle } = props;

    return (
        <NotificationContainer>
            <Snackbar
                autoHideTime={autoHideTime - 2 * 500}
                show={show}
            >
                {image}
                <Container
                    direction="column"
                    align="center"
                    justify="center"
                >
                    <Title>{title}</Title>
                    <Paragraph>{subtitle}</Paragraph>
                </Container>
            </Snackbar>
        </NotificationContainer>
    );
}

export default Notification;
export type { NotificationProps };
