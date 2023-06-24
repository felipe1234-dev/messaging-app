import { useState, useEffect } from "react";

import { MessageCard, Input, Avatar } from "@components";
import { Container } from "@styles/layout";
import { Message, User } from "messaging-app-globals";

import { useAuth } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

const paddingX = 50;
const paddingY = 25;

function ChatMessages() {
    const { user } = useAuth();
    const { chatWindow } = useChatWindow();
    const [messageEl, setMessageEl] = useState<HTMLDivElement | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!messageEl) return;
        messageEl.scrollTop = messageEl.scrollHeight;
    }, [messageEl]);

    if (!user || !chatWindow) return <></>;

    return (
        <Container
            variant="primary"
            direction="column"
            align="center"
            justify="start"
            flex="1 1"
            width="100%"
            overflowY="hidden"
            overflowX="hidden"
        >
            <Container
                ref={(el) => setMessageEl(el)}
                transparent
                direction="column"
                align="center"
                justify="start"
                width={`calc(100% - ${2 * paddingX}px)`}
                px={paddingX}
                py={paddingY}
                overflowY="auto"
                overflowX="hidden"
            >
                {chatWindow?.messages
                    .map((message) => {
                        const sender = chatWindow.members.find(
                            (member) => member.uid === message.sentBy
                        );

                        return [message, sender] as [Message, User];
                    })
                    .filter(([, sender]) => !!sender)
                    .map(([message, sender]) => (
                        <MessageCard
                            key={message.uid}
                            message={message}
                            sender={sender}
                        />
                    ))}
            </Container>
            <Container
                transparent
                direction="column"
                align="center"
                justify="start"
                width={`calc(100% - ${2 * paddingX}px)`}
                flex="1 1"
                px={paddingX}
                py={paddingY}
            >
                <Input
                    variant="secondary"
                    leftIcon={
                        <Avatar
                            src={user.photo}
                            alt={user.name}
                        />
                    }
                    placeholder="Your message..."
                    onChange={(evt) => setMessage(evt.target.value)}
                    value={message}
                    light={0.05}
                />
            </Container>
        </Container>
    );
}

export default ChatMessages;
