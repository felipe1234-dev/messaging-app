import { useMemo, useState, useEffect } from "react";

import { MessageCard, Input, Avatar } from "@components";
import { Container, Icon, Columns, Paragraph } from "@styles/layout";
import { Message, User } from "messaging-app-globals";

import { Api } from "@services";
import { timeAgo } from "@functions";
import { useAuth, useAlert } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { SendPlane } from "@styled-icons/remix-fill";

const paddingX = 50;
const paddingY = 25;

function ChatMessages() {
    const { user } = useAuth();
    const { chatWindow } = useChatWindow();
    const alert = useAlert();

    const [messageEl, setMessageEl] = useState<HTMLDivElement | null>(null);
    const [message, setMessage] = useState("");

    const scrollToBottom = () => {
        if (!messageEl) return;

        messageEl.scrollTo({
            top: messageEl.scrollHeight,
            behavior: "smooth",
        });
    };

    const handleSendMessage = () => {
        if (!user || !chatWindow) return;

        Api.chats
            .connect(user, chatWindow)
            .sendTextMessage(message)
            .then(() => {
                setMessage("");
                scrollToBottom();
            })
            .catch((err) => alert.error(err));
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageEl]);

    const chatMessages = useMemo(() => {
        let prevSender: User | undefined = undefined;

        return (chatWindow?.messages || []).reduce(
            (messages, message) => {
                const messageDate = message.createdAt.toDateString();
                const sender = chatWindow?.members.find(
                    (member) => member.uid === message.sentBy
                );
                let showSender = true;

                if (!sender) return messages;

                if (!messages[messageDate]) {
                    showSender = true;
                    messages[messageDate] = [];
                } else {
                    showSender = prevSender?.uid !== sender.uid;
                }

                messages[messageDate].push([message, sender, showSender]);

                prevSender = sender;

                return messages;
            },
            {} as {
                [time: string]: [
                    message: Message,
                    sender: User,
                    showSender: boolean
                ][];
            }
        );
    }, [chatWindow]);

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
                {Object.entries(chatMessages).map(
                    ([timeAgo, messagesAndSenders]) => (
                        <>
                            <Columns
                                align="center"
                                justify="center"
                                width="100%"
                            >
                                <Paragraph variant="secondary">
                                    {timeAgo}
                                </Paragraph>
                            </Columns>
                            {messagesAndSenders.map(
                                ([message, sender, showSender]) => (
                                    <MessageCard
                                        key={message.uid}
                                        message={message}
                                        sender={sender}
                                        showSender={showSender}
                                    />
                                )
                            )}
                        </>
                    )
                )}
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
                    rightIcon={
                        <Icon
                            icon={<SendPlane />}
                            size={2}
                        />
                    }
                    rightIconVariant="highlight"
                    onRightIconClick={handleSendMessage}
                    onEnterPress={handleSendMessage}
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
