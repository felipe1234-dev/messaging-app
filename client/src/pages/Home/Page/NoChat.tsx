import { appName } from "@constants";
import { Container, Icon, Title, Paragraph } from "@styles/layout";
import { Rocket } from "@styled-icons/fluentui-system-regular";

function NoChat() {
    return (
        <Container
            variant="primary"
            direction="column"
            justify="center"
            align="center"
            height="100%"
            flex="1"
            gap={8}
        >
            <Icon
                variant="secondary"
                icon={<Rocket />}
                size={8}
            />
            <Title level={3}>{appName}</Title>
        </Container>
    );
}

export default NoChat;
