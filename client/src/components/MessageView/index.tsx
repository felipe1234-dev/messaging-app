import { useMemo } from "react";

import { Container, Paragraph, Icon } from "@styles/layout";
import { getTimeCodeFromMs } from "@functions";
import { Message, TextMessage, AudioMessage } from "messaging-app-globals";

import { Microphone } from "@styled-icons/boxicons-regular";

import AudioPlayer from "../AudioPlayer";

interface MessageViewProps {
    message: Message;
    color?: string;
    wasReplied?: boolean;
    shortened?: boolean;
}

function MessageView(props: MessageViewProps) {
    const { message, color, wasReplied = false, shortened = false } = props;

    const isTextMessage = TextMessage.isTextMessage(message);
    const isAudioMessage = AudioMessage.isAudioMessage(message);

    const audioDuration = useMemo(() => {
        if (!isAudioMessage) return "";

        const timeElapsed = message.audio.duration;
        return getTimeCodeFromMs(timeElapsed);
    }, [isAudioMessage ? message.audio.duration : 0]);

    return (
        <>
            {wasReplied && message.deleted ? (
                "Message deleted at " + message.deletedAt?.toDateString()
            ) : isTextMessage ? (
                message.text
            ) : isAudioMessage ? (
                shortened ? (
                    <Container
                        transparent
                        direction="row"
                        justify="start"
                        align="center"
                        gap={8}
                    >
                        <Icon
                            variant="highlight"
                            icon={<Microphone />}
                        />
                        <Paragraph variant="secondary">
                            {audioDuration}
                        </Paragraph>
                    </Container>
                ) : (
                    <Container
                        transparent
                        direction="row"
                        justify="center"
                        align="center"
                        gap={8}
                        width="300px"
                    >
                        <AudioPlayer
                            src={message.audio.url}
                            color={color}
                        />
                    </Container>
                )
            ) : (
                <></>
            )}
        </>
    );
}

export default MessageView;
export type { MessageViewProps };
