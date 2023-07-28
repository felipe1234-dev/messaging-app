import axios, { AxiosError } from "axios";
import { JSONToURLQuery, isLocal } from "@functions";
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
    WrapperUser,
    WrapperChat,
    QueryListener,
    DocumentListener,
    QuerySnapshot,
    DocumentSnapshot,
    DocumentData,
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

            return (data.messages as any[]).map((message) => {
                if (TextMessage.isTextMessage(message)) {
                    return new TextMessage(message);
                } else if (AudioMessage.isAudioMessage(message)) {
                    return new AudioMessage(message);
                } else if (VideoMessage.isVideoMessage(message)) {
                    return new VideoMessage(message);
                } else {
                    return new Message(message);
                }
            });
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

        connect: (user: WrapperUser, chat: WrapperChat) => {
            const memberUids = chat.members.map((member) => member.uid);
            const blockedUids = chat.blocked.map((member) => member.uid);

            if (!memberUids.includes(user.uid) && !user.admin) {
                throw new Error("You don't participate in this chat");
            }

            if (blockedUids.includes(user.uid)) {
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
                sendTextMessage: (text: string) => {
                    const textMessage = new TextMessage({
                        text,
                        chat: chat.uid,
                        sentBy: user.uid,
                    });

                    return messageCollection
                        .doc(textMessage.uid)
                        .set({ ...textMessage });
                },
            };
        },
    },
    messages: {
        sendTextMessage: async (chatUid: string, text: string) => {
            await httpEndpoint.put("/send/text/message", {
                text,
                chat: chatUid,
            });
        },
        onMessageSentToChat: (
            chatUid: string,
            callback: (message: Message) => void,
            runOnInit = false
        ): Unsubscribe => {
            return messageCollection.where("chat", "==", chatUid).onSnapshot(
                createQueryListener(runOnInit, (snapshot) => {
                    console.log("callback run");

                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "added") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Message not found");

                        const data = doc.data();
                        let msg: Message;

                        if (TextMessage.isTextMessage(data)) {
                            msg = new TextMessage(data);
                        } else if (AudioMessage.isAudioMessage(data)) {
                            msg = new AudioMessage(data);
                        } else if (VideoMessage.isVideoMessage(data)) {
                            msg = new VideoMessage(data);
                        } else {
                            msg = new Message(data);
                        }

                        callback(msg);
                    }
                })
            );
        },
        onTextMessageSentToChat: (
            chatUid: string,
            callback: (message: TextMessage) => void,
            runOnInit = false
        ) => {
            return messageCollection.where("chat", "==", chatUid).onSnapshot(
                createQueryListener(runOnInit, (snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "added") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Message not found");

                        const data = doc.data();
                        if (!TextMessage.isTextMessage(data)) continue;

                        const msg = new TextMessage(data);
                        callback(msg);
                    }
                })
            );
        },
        onVideoMessageSentToChat: (
            chatUid: string,
            callback: (message: VideoMessage) => void,
            runOnInit = false
        ) => {
            return messageCollection.where("chat", "==", chatUid).onSnapshot(
                createQueryListener(runOnInit, (snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "added") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Message not found");

                        const data = doc.data();
                        if (!VideoMessage.isVideoMessage(data)) continue;

                        const msg = new VideoMessage(data);
                        callback(msg);
                    }
                })
            );
        },
        onAudioMessageSentToChat: (
            chatUid: string,
            callback: (message: AudioMessage) => void,
            runOnInit = false
        ) => {
            return messageCollection.where("chat", "==", chatUid).onSnapshot(
                createQueryListener(runOnInit, (snapshot) => {
                    for (const change of snapshot.docChanges()) {
                        const type = change.type;
                        if (type !== "added") continue;

                        const doc = change.doc;
                        if (!doc.exists) throw new Error("Message not found");

                        const data = doc.data();
                        if (!AudioMessage.isAudioMessage(data)) continue;

                        const msg = new AudioMessage(data);
                        callback(msg);
                    }
                })
            );
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
        uploadImage: async (
            file: File,
            path: string,
            metadata?: {
                [key: string]: any;
            }
        ): Promise<string> => {
            const arrayBuffer = new Uint8Array(await file.arrayBuffer());
            const bufferAsNums = Array.from(arrayBuffer);

            const { data } = await httpEndpoint.post("/media/images/", {
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
