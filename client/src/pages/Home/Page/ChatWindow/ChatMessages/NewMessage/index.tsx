import { useState, useEffect, Dispatch, SetStateAction } from "react";

import { Message, TextMessage, AudioMessage } from "messaging-app-globals";

import { useAuth } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { TextSpan } from "@styles/layout";
import { NewMessageContainer } from "./styles";

import MessagePreview from "./MessagePreview";
import NewTextMessage from "./NewTextMessage";
import NewAudioMessage from "./NewAudioMessage";

interface NewMessageProps {
    scrollToBottom: () => void;
    messageToReply?: Message | undefined;
    setMessageToReply: Dispatch<SetStateAction<Message | undefined>>;
    messageToEdit?: Message | undefined;
    setMessageToEdit: Dispatch<SetStateAction<Message | undefined>>;
}

function NewMessage(props: NewMessageProps) {
    const {
        scrollToBottom,
        messageToReply,
        setMessageToReply,
        messageToEdit,
        setMessageToEdit,
    } = props;

    const { user } = useAuth();
    const { chatWindow } = useChatWindow();

    const [newMessage, setNewMessage] = useState<Message>(new TextMessage());

    const isTextMessage = TextMessage.isTextMessage(newMessage);
    const isAudioMessage = AudioMessage.isAudioMessage(newMessage);

    const handleRecordAudio = () => {
        setNewMessage(new AudioMessage());
    };

    const handleCancelReply = () => {
        setMessageToReply(undefined);
    };

    const handleCancelEdition = () => {
        setMessageToEdit(undefined);
        setNewMessage(new TextMessage());
    };

    const handleResetMessage = () => {
        setNewMessage(new TextMessage());
        setMessageToReply(undefined);
        setMessageToEdit(undefined);
    };

    useEffect(() => {
        if (!messageToEdit?.uid) return;
        setNewMessage(messageToEdit.clone());
    }, [messageToEdit]);

    if (!user || !chatWindow) return <></>;

    const messageToReplySender = chatWindow.members.find(
        (member) => member.uid === messageToReply?.sentBy
    );

    const baseProps = {
        scrollToBottom,
        recordAudio: handleRecordAudio,
        resetMessage: handleResetMessage,
        messageToEdit,
        setMessageToEdit,
        messageToReply,
        setMessageToReply,
    };

    return (
        <NewMessageContainer>
            {messageToReply && messageToReplySender && (
                <MessagePreview
                    header={
                        <>
                            Replying to{" "}
                            <TextSpan variant="highlight">
                                {messageToReplySender.name}
                            </TextSpan>{" "}
                        </>
                    }
                    message={messageToReply}
                    onCancel={handleCancelReply}
                />
            )}
            {messageToEdit && (
                <MessagePreview
                    header="Editting message"
                    message={messageToEdit}
                    onCancel={handleCancelEdition}
                />
            )}
            {isTextMessage ? (
                <NewTextMessage
                    textMessage={newMessage}
                    setTextMessage={setNewMessage}
                    {...baseProps}
                />
            ) : isAudioMessage ? (
                <NewAudioMessage
                    audioMessage={newMessage}
                    setAudioMessage={setNewMessage}
                    {...baseProps}
                />
            ) : (
                <></>
            )}
        </NewMessageContainer>
    );
}

export default NewMessage;
