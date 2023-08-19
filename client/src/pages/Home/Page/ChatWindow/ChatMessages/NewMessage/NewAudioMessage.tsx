import { useState, Dispatch, SetStateAction } from "react";
import { Message, AudioMessage } from "messaging-app-globals";

import { useAuth, useAlert } from "@providers";
import { useChatWindow } from "@pages/Home/providers";

import { AudioRecorder } from "@components";
import { useInterval } from "@hooks";
import { Api } from "@services";
import { AudioInfo } from "@types";

interface NewAudioMessageProps {
    audioMessage: AudioMessage;
    setAudioMessage: Dispatch<SetStateAction<Message>>;
    scrollToBottom: () => void;
    resetMessage: () => void;
    messageToReply?: Message | undefined;
    setMessageToReply: Dispatch<SetStateAction<Message | undefined>>;
    messageToEdit?: Message | undefined;
    setMessageToEdit: Dispatch<SetStateAction<Message | undefined>>;
}

function NewAudioMessage(props: NewAudioMessageProps) {
    const {
        audioMessage,
        scrollToBottom,
        resetMessage,
        messageToReply,
        messageToEdit,
    } = props;

    const { user } = useAuth();
    const { chatWindow } = useChatWindow();
    const alert = useAlert();

    const [startedAudioAt, setStartedAudioAt] = useState<Date>();
    const isAudioMessage = AudioMessage.isAudioMessage(audioMessage);

    const handleOnRecordAudio = () => {
        if (!user || !chatWindow || !isAudioMessage) return;

        setStartedAudioAt(new Date());
        Api.chats.connect(user, chatWindow).isRecordingAudio();
    };

    const handleSendMessage = async () => {
        if (!user || !chatWindow) return;

        const connection = Api.chats.connect(user, chatWindow);
        const isEditting = !!messageToEdit?.uid;
        let promise: Promise<void>;

        if (!isEditting) {
            promise = connection.sendAudioMessage(
                audioMessage.audio.url,
                audioMessage.audio.duration,
                messageToReply?.uid
            );
        } else {
            promise = connection.editMessage(audioMessage, messageToEdit);
        }

        try {
            await promise;
            resetMessage();
            scrollToBottom();
        } catch (err) {
            alert.error((err as Error).message);
        }
    };

    const handleSaveAudio = async (result: Blob, audioInfo: AudioInfo) => {
        if (!user || !chatWindow || !isAudioMessage) return;

        const file = new File(
            [result],
            `${new Date()}-${user.name}'s-audio.mp4`
        );
        const path = `chats/${chatWindow.uid}/audios/${file.name}`;

        try {
            const { url } = await Api.media.upload(file, path, {
                ...audioInfo,
            });

            audioMessage.audio.url = url;
            audioMessage.audio.duration = audioInfo.duration;
            audioMessage.audio.unit = "ms";

            await handleSendMessage();
        } catch (err) {
            alert.error((err as Error).message);
        }
    };

    useInterval(
        (timerId) => {
            if (!startedAudioAt || !user || !chatWindow)
                return clearInterval(timerId);

            const today = new Date();
            const intervalSecs =
                (today.getTime() - startedAudioAt.getTime()) / 1000;

            if (intervalSecs >= 1) {
                setStartedAudioAt(undefined);
                Api.chats.connect(user, chatWindow).isNotRecordingAudio();
                clearInterval(timerId);
            }
        },
        1000,
        [startedAudioAt]
    );

    if (!user || !chatWindow) return <></>;

    return (
        <AudioRecorder
            autoStart
            color={chatWindow.color || ""}
            onData={handleOnRecordAudio}
            onSave={handleSaveAudio}
            onClose={resetMessage}
        />
    );
}

export default NewAudioMessage;
