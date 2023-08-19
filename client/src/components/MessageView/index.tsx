import { useMemo } from "react";
import {
    Message,
    TextMessage,
    AudioMessage,
    Media,
} from "messaging-app-globals";

import { getTimeCodeFromMs } from "@functions";

import { Container, Paragraph, Icon } from "@styles/layout";
import { Microphone } from "@styled-icons/boxicons-regular";

import AudioPlayer from "../AudioPlayer";
import MediaViewer from "../MediaViewer";

interface MessageViewProps {
    message: Message;
    color?: string;
    wasReplied?: boolean;
    shortened?: boolean;
    hideAttachments?: boolean;
}

function MessageView(props: MessageViewProps) {
    const {
        message,
        color,
        wasReplied = false,
        shortened = false,
        hideAttachments = false,
    } = props;

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
                <>
                    {message.text}
                    {message.attachments &&
                        message.attachments.length > 0 &&
                        !hideAttachments &&
                        !shortened && (
                            <Container
                                as="span"
                                transparent
                                direction="column"
                                justify="start"
                                align="center"
                                gap={8}
                            >
                                {message.attachments.map((attachment, i) => (
                                    <MediaViewer
                                        key={attachment.url}
                                        media={new Media({ ...attachment })}
                                    />
                                ))}
                            </Container>
                        )}
                </>
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
