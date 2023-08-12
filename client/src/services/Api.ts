import axios, { AxiosError } from "axios";
import {
    JSONToURLQuery,
    isLocal,
    dataToMessageModel,
    wrapperChatToChat,
    getChanges,
} from "@functions";
import {
    FilterParams,
    User,
    Chat,
    Message,
    FriendRequest,
    TextMessage,
    AudioMessage,
    VideoMessage,
    secureUserData,
} from "messaging-app-globals";
import {
    ResponseError,
    isResponseError,
    Unsubscribe,
    WrapperChat,
    QueryListener,
    DocumentListener,
    QuerySnapshot,
    DocumentSnapshot,
    DocumentData,
    isWrapperChat,
} from "@types";
import {
    auth,
    chatCollection,
    messageCollection,
    userCollection,
    friendRequestCollection,
} from "./firebase";

const apiURL = isLocal()
    ? "http://127.0.0.1:5001/screen-recorder-b7354/us-central1/default"
    : "";

const httpEndpoint = axios.create({
    baseURL: apiURL,
    timeout: 0,
});

httpEndpoint.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const responseData = error.response?.data;

        if (isResponseError(responseData)) {
            const responseError: ResponseError = {
                ...error,
                ...responseData,
            };

            return Promise.reject(responseError);
        } else {
            return Promise.reject(error);
        }
    }
);

function createSnapshotListener<T>(
    runOnInit: boolean,
    callback: (snapshot: T) => void
) {
    let initialLoad = true;

    return (snapshot: T) => {
        if (initialLoad) {
            initialLoad = false;
            if (!runOnInit) return;
        }

        callback(snapshot);
    };
}

function createQueryListener(runOnInit: boolean, callback: QueryListener) {
    return createSnapshotListener<QuerySnapshot<DocumentData>>(
        runOnInit,
        callback
    );
}

function createDocumentListener(
    runOnInit: boolean,
    callback: DocumentListener
) {
    return createSnapshotListener<DocumentSnapshot<DocumentData>>(
        runOnInit,
        callback
    );
}

const Api = {
    httpEndpoint,

    ping: async () => {
        await httpEndpoint.get("/ping");
    },

    auth: {
        recoverSession: async () => {
            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const { data } = await httpEndpoint.post("/auth/session", {
                    refreshToken,
                });

                const user = new User(data.user);
                httpEndpoint.defaults.headers.common.authorization = data.token;
                await auth.signInAnonymously();

                return user;
            } catch {
                localStorage.removeItem("refreshToken");
                await auth.signOut();
                return undefined;
            }
        },
        login: async (
            email: string,
            password: string,
            rememberMe?: boolean
        ) => {
            const { data } = await httpEndpoint.post("/auth/login", {
                email,
                password,
                rememberMe,
            });

            const token: string = data.token;
            const refreshToken: string = data.refreshToken;
            const rememberMeToken: string = data.rememberMeToken;

            httpEndpoint.defaults.headers.common.authorization = token;
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("rememberMeToken", rememberMeToken);
            await auth.signInAnonymously();

            return new User(data.user);
        },
        logout: async () => {
            await httpEndpoint.post("/auth/logout");
            httpEndpoint.defaults.headers.common.authorization = "";
            localStorage.removeItem("refreshToken");
            await auth.signOut();
        },
        register: async (name: string, email: string, password: string) => {
            await httpEndpoint.post("/auth/register", {
                name,
                email,
                password,
            });
        },
    },
    friends: {
        list: async () => {
            const { data } = await httpEndpoint.get("/friends");
            return (data.friends as any[]).map((friend) => new User(friend));
        },

        unfriend: async (friendUid: string) => {
            await httpEndpoint.delete(`/friends/${friendUid}`);
        },

        onFriendListUpdated: (
            userUid: string,
            callback: (friend: User) => void,
            runOnInit = false
        ): Unsubscribe => {
            return userCollection
                .where("friends", "array-contains", userUid)
                .onSnapshot(
                    createQueryListener(runOnInit, (snapshot) => {
                        for (const change of snapshot.docChanges()) {
                            const type = change.type;
                            if (type !== "modified") continue;

                            const doc = change.doc;
                            if (!doc.exists)
                                throw new Error("Friend not found");

                            const friend = secureUserData(new User(doc.data()));
                            callback(friend);
                        }
                    })
                );
        },
    },
    friendRequests: {
        list: async () => {
            const { data } = await httpEndpoint.get("/friend-requests");
            return (data.friendRequests as any[]).map(
                (friendRequest) => new FriendRequest(friendRequest)
            );
        },

        send: async (userUid: string) => {
            await httpEndpoint.post("/friend-requests", { to: userUid });
        },

        delete: async (friendRequestUid: string) => {
            await httpEndpoint.delete(`/friend-requests/${friendRequestUid}`);
        },

        accept: async (friendRequestUid: string) => {
            await httpEndpoint.post(
                `/friend-requests/${friendRequestUid}/accept`
            );
        },

        reject: async (friendRequestUid: string) => {
            await httpEndpoint.post(
                `/friend-requests/${friendRequestUid}/reject`
            );
        },

        onFriendRequestReceived: (
            userUid: string,
            callback: (friendRequest: FriendRequest) => void,
            runOnInit = false
        ): Unsubscribe => {
            return friendRequestCollection
                .where("to", "==", userUid)
                .onSnapshot(
                    createQueryListener(runOnInit, (snapshot) => {
                        for (const change of snapshot.docChanges()) {
                            const type = change.type;
                            if (type !== "added") continue;

                            const doc = change.doc;
                            if (!doc.exists)
                                throw new Error("Friend request not found");

                            const friendRequest = new FriendRequest(doc.data());
                            callback(friendRequest);
                        }
                    })
                );
        },

        onFriendRequestSent: (
            userUid: string,
            callback: (friendRequest: FriendRequest) => void,
            runOnInit = false
        ): Unsubscribe => {
            return friendRequestCollection
                .where("from", "==", userUid)
                .onSnapshot(
                    createQueryListener(runOnInit, (snapshot) => {
                        for (const change of snapshot.docChanges()) {
                            const type = change.type;
                            if (type !== "added") continue;

                            const doc = change.doc;
                            if (!doc.exists)
                                throw new Error("Friend request not found");

                            const friendRequest = new FriendRequest(doc.data());
                            callback(friendRequest);
                        }
                    })
                );
        },

        onFriendRequestUpdated: (
            userUid: string,
            callback: (friendRequest: FriendRequest) => void,
            runOnInit = false
        ): Unsubscribe => {
            return friendRequestCollection
                .where("users", "array-contains", userUid)
                .onSnapshot(
                    createQueryListener(runOnInit, (snapshot) => {
                        for (const change of snapshot.docChanges()) {
                            const type = change.type;
                            if (type !== "modified") continue;

                            const doc = change.doc;
                            if (!doc.exists)
                                throw new Error("Friend request not found");

                            const friendRequest = new FriendRequest(doc.data());
                            callback(friendRequest);
                        }
                    })
                );
        },
    },
    chats: {
        getUserChats: async () => {
            const { data } = await httpEndpoint.get("/chats");
            return (data.chats as any[]).map((chat) => new Chat(chat));
        },
        getChatMembers: async (chatUid: string) => {
            const { data } = await httpEndpoint.get(
                `/chats/${chatUid}/members`
            );
            return (data.members as any[]).map((member) => new User(member));
        },
        getChatMessages: async (
            chatUid: string,
            filters: {
                limit?: number;
                startAfter?: string;
                orderBy?: [field: string, direction: "desc" | "asc"];
            } = {}
        ) => {
            const { data } = await httpEndpoint.get(
                `/chats/${chatUid}/messages/?${JSONToURLQuery(filters)}`
            );

            return (data.messages as any[]).map(dataToMessageModel);
        },

        update: async (chatUid: string, updates: Partial<Chat>) => {
            await httpEndpoint.put(`/chats/${chatUid}/`, updates);
        },

        onUserChatUpdated: (
            userUid: string,
            callback: (chat: Chat) => void,
            runOnInit = false
        ): Unsubscribe => {
            return chatCollection
                .where("members", "array-contains", userUid)
                .onSnapshot(
                    createQueryListener(runOnInit, (snapshot) => {
                        for (const change of snapshot.docChanges()) {
                            const type = change.type;
                            if (type !== "modified") continue;

                            const doc = change.doc;
                            if (!doc.exists) throw new Error("Chat not found");

                            const chat = new Chat(doc.data());
                            callback(chat);
                        }
                    })
                );
        },

        connect: (user: User, chat: Chat | WrapperChat) => {
            if (isWrapperChat(chat)) {
                chat = wrapperChatToChat(chat);
            }

            if (!chat.members.includes(user.uid) && !user.admin) {
                throw new Error("You don't participate in this chat");
            }

            if (chat.blocked.includes(user.uid)) {
                throw new Error("You were blocked");
            }

            return {
                isTyping: () => {
                    return chatCollection.doc(chat.uid).update({
                        typing: Array.from(new Set([...chat.typing, user.uid])),
                    });
                },
                isNotTyping: () => {
                    return chatCollection.doc(chat.uid).update({
                        typing: Array.from(
                            new Set(
                                chat.typing.filter((uid) => uid !== user.uid)
                            )
                        ),
                    });
                },
                isRecordingAudio: () => {
                    return chatCollection.doc(chat.uid).update({
                        recordingAudio: Array.from(
                            new Set([...chat.recordingAudio, user.uid])
                        ),
                    });
                },
                isNotRecordingAudio: () => {
                    return chatCollection.doc(chat.uid).update({
                        recordingAudio: Array.from(
                            new Set(
                                chat.recordingAudio.filter(
                                    (uid) => uid !== user.uid
                                )
                            )
                        ),
                    });
                },
                sendTextMessage: (text: string, replyTo?: string) => {
                    const textMessage = new TextMessage({
                        text,
                        repliedTo: replyTo,
                        chat: chat.uid,
                        sentBy: user.uid,
                    });

                    return messageCollection
                        .doc(textMessage.uid)
                        .set({ ...textMessage });
                },
                sendAudioMessage: (
                    url: string,
                    duration: number,
                    replyTo?: string
                ) => {
                    const audioMessage = new AudioMessage({
                        audio: {
                            url,
                            duration,
                            unit: "ms",
                        },
                        repliedTo: replyTo,
                        chat: chat.uid,
                        sentBy: user.uid,
                    });

                    return messageCollection
                        .doc(audioMessage.uid)
                        .set({ ...audioMessage });
                },
                deleteMessage: (messageUid: string) => {
                    return messageCollection.doc(messageUid).update({
                        deleted: true,
                        deletedAt: new Date(),
                        deletedBy: user.uid,
                    });
                },
                getMessage: async (messageUid: string) => {
                    const snapshot = await messageCollection
                        .doc(messageUid)
                        .get();

                    if (!snapshot.exists) throw new Error("Message not found");

                    const data = snapshot.data();
                    return dataToMessageModel(data);
                },
                viewMessage: (message: Message) => {
                    const alreadyViewed = !!message.history.find(
                        (item) => item.type === "view" && item.user === user.uid
                    );
                    if (alreadyViewed) return;

                    message.history.push({
                        type: "view",
                        date: new Date(),
                        user: user.uid,
                        extra: {},
                    });

                    return messageCollection.doc(message.uid).update({
                        history: message.history,
                    });
                },
                editMessage: (newMessage: Message, oldMessage: Message) => {
                    const historyItem = {
                        type: "edit" as "edit",
                        date: new Date(),
                        user: user.uid,
                        extra: {
                            changes: getChanges(newMessage, oldMessage),
                        },
                    };

                    newMessage.history.push(historyItem);

                    return messageCollection
                        .doc(newMessage.uid)
                        .update({ ...newMessage });
                },
                onMessageSent: (
                    callback: (message: Message) => void,
                    runOnInit = false
                ): Unsubscribe => {
                    return messageCollection
                        .where("chat", "==", chat.uid)
                        .onSnapshot(
                            createQueryListener(runOnInit, (snapshot) => {
                                for (const change of snapshot.docChanges()) {
                                    const type = change.type;
                                    if (type !== "added") continue;

                                    const doc = change.doc;
                                    if (!doc.exists)
                                        throw new Error("Message not found");

                                    const data = doc.data();
                                    const msg = dataToMessageModel(data);

                                    callback(msg);
                                }
                            })
                        );
                },
                onMessageUpdated: (
                    callback: (message: Message) => void,
                    runOnInit = false
                ) => {
                    return messageCollection
                        .where("chat", "==", chat.uid)
                        .onSnapshot(
                            createQueryListener(runOnInit, (snapshot) => {
                                for (const change of snapshot.docChanges()) {
                                    const type = change.type;
                                    if (type !== "modified") continue;

                                    const doc = change.doc;
                                    if (!doc.exists)
                                        throw new Error("Message not found");

                                    const data = doc.data();
                                    const msg = dataToMessageModel(data);

                                    callback(msg);
                                }
                            })
                        );
                },
                onTextMessageSent: (
                    callback: (message: TextMessage) => void,
                    runOnInit = false
                ) => {
                    return messageCollection
                        .where("chat", "==", chat.uid)
                        .onSnapshot(
                            createQueryListener(runOnInit, (snapshot) => {
                                for (const change of snapshot.docChanges()) {
                                    const type = change.type;
                                    if (type !== "added") continue;

                                    const doc = change.doc;
                                    if (!doc.exists)
                                        throw new Error("Message not found");

                                    const data = doc.data();
                                    if (!TextMessage.isTextMessage(data))
                                        continue;

                                    const msg = new TextMessage(data);
                                    callback(msg);
                                }
                            })
                        );
                },
                onVideoMessageSent: (
                    callback: (message: VideoMessage) => void,
                    runOnInit = false
                ) => {
                    return messageCollection
                        .where("chat", "==", chat.uid)
                        .onSnapshot(
                            createQueryListener(runOnInit, (snapshot) => {
                                for (const change of snapshot.docChanges()) {
                                    const type = change.type;
                                    if (type !== "added") continue;

                                    const doc = change.doc;
                                    if (!doc.exists)
                                        throw new Error("Message not found");

                                    const data = doc.data();
                                    if (!VideoMessage.isVideoMessage(data))
                                        continue;

                                    const msg = new VideoMessage(data);
                                    callback(msg);
                                }
                            })
                        );
                },
                onAudioMessageSent: (
                    callback: (message: AudioMessage) => void,
                    runOnInit = false
                ) => {
                    return messageCollection
                        .where("chat", "==", chat.uid)
                        .onSnapshot(
                            createQueryListener(runOnInit, (snapshot) => {
                                for (const change of snapshot.docChanges()) {
                                    const type = change.type;
                                    if (type !== "added") continue;

                                    const doc = change.doc;
                                    if (!doc.exists)
                                        throw new Error("Message not found");

                                    const data = doc.data();
                                    if (!AudioMessage.isAudioMessage(data))
                                        continue;

                                    const msg = new AudioMessage(data);
                                    callback(msg);
                                }
                            })
                        );
                },
            };
        },
    },
    users: {
        list: async (filters: FilterParams) => {
            const filtersCopy = { ...filters };
            delete filtersCopy.wheres;

            const urlQuery = JSONToURLQuery({
                ...filtersCopy,
                where: (filters.wheres || [])
                    .map((where) => where.join(""))
                    .join(","),
            });

            const { data } = await httpEndpoint.get(`/users/?${urlQuery}`);
            return (data.users as any[]).map((user) => new User(user));
        },
        byUid: async (userUid: string) => {
            const { data } = await httpEndpoint.get(`/users/${userUid}`);
            const user = new User(data.user);
            return user;
        },
        onUserUpdated: (
            userUid: string,
            callback: (user: User) => void,
            runOnInit = false
        ): Unsubscribe => {
            return userCollection.doc(userUid).onSnapshot(
                createDocumentListener(runOnInit, (snapshot) => {
                    if (!snapshot.exists) throw new Error("User not found");

                    const user = secureUserData(new User(snapshot.data()));
                    callback(user);
                })
            );
        },
    },
    media: {
        upload: async (
            file: File,
            path: string,
            metadata?: {
                [key: string]: any;
            }
        ): Promise<string> => {
            const arrayBuffer = new Uint8Array(await file.arrayBuffer());
            const bufferAsNums = Array.from(arrayBuffer);

            const { data } = await httpEndpoint.post("/media/", {
                filename: file.name,
                size: file.size,
                mimetype: file.type,
                buffer: bufferAsNums,
                path,
                metadata,
            });

            const { url = "" } = data;

            return url;
        },
    },
};

export default Api;
