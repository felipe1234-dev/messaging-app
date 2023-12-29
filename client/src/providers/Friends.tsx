import React, { createContext, useState, useEffect, useContext } from "react";
import { User as Friend, FriendRequest } from "messaging-app-globals";
import { Api } from "@services";
import { useAuth } from "./Auth";
import { useAlert } from "./Alert";
import { useNotification } from "./Notification";

interface FriendsValue {
    friends: Friend[];
    friendRequests: FriendRequest[];
    unasweredFriendRequests: FriendRequest[];
}

const FriendsContext = createContext<FriendsValue>({
    friends: [],
    friendRequests: [],
    unasweredFriendRequests: [],
});

function FriendsProvider({ children }: { children: React.ReactNode }) {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const { user } = useAuth();
    const alert = useAlert();
    const notif = useNotification();

    const fetchFriends = async () => {
        try {
            setFriends(
                (await Api.friends.list()).sort((a, b) => {
                    if (a.online && !b.online) return -1;
                    if (b.online && !a.online) return 1;

                    if (
                        a.online &&
                        b.online &&
                        a.sessionStart &&
                        b.sessionStart
                    ) {
                        if (a.sessionStart > b.sessionStart) return -1;
                        if (a.sessionStart < b.sessionStart) return 1;
                    }

                    if (
                        !a.online &&
                        !b.online &&
                        a.sessionEnd &&
                        b.sessionEnd
                    ) {
                        if (a.sessionEnd > b.sessionEnd) return -1;
                        if (a.sessionEnd < b.sessionEnd) return 1;
                    }

                    return 0;
                })
            );
        } catch (err) {
            alert.error((err as Error).message);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            setFriendRequests(await Api.friendRequests.list());
        } catch (err) {
            alert.error((err as Error).message);
        }
    };

    const onFriendUpdated = (updatedFriend: Friend) => {
        setFriends((prev) => {
            const nonUpdatedData = prev.find(
                (friend) => friend.uid === updatedFriend.uid
            );
            const updatedFriendJson = JSON.stringify(updatedFriend);
            const nonUpdatedFriendJson = JSON.stringify(nonUpdatedData);
            const areDifferent = updatedFriendJson !== nonUpdatedFriendJson;

            if (!areDifferent) return prev; // Prevent state rerender by returning the same variable reference

            return prev.map((friend) => {
                if (friend.uid === updatedFriend.uid) return updatedFriend;
                return friend;
            });
        });
    };

    const onUpdateFriendRequests = (friendRequest: FriendRequest) => {
        setFriendRequests((prev) => {
            const alreadyExists = !!prev.find(
                (fr) => fr.uid === friendRequest.uid
            );

            if (alreadyExists) {
                return prev.map((fr) => {
                    if (fr.uid === friendRequest.uid) return friendRequest;
                    return fr;
                });
            } else {
                return [...prev, friendRequest];
            }
        });
    };

    const onFriendRequestReceived = (friendRequest: FriendRequest) => {
        notif.notify({
            image: <></>,
            title: <b>Friend request received!</b>,
            subtitle: "",
        });
        onUpdateFriendRequests(friendRequest);
    };

    useEffect(() => {
        if (!user?.uid) return setFriendRequests([]);
        fetchFriendRequests();
    }, [user?.uid]);

    useEffect(() => {
        if (!user?.uid) return;
        if (user.friends.length === 0) return;

        fetchFriends();
    }, [user?.uid, user?.friends.length]);

    useEffect(() => {
        if (!user?.uid) return;

        Api.friends.onFriendListUpdated(user.uid, onFriendUpdated);
        Api.friendRequests.onFriendRequestReceived(
            user.uid,
            onFriendRequestReceived
        );
        Api.friendRequests.onFriendRequestSent(
            user.uid,
            onUpdateFriendRequests
        );
        Api.friendRequests.onFriendRequestUpdated(
            user.uid,
            onUpdateFriendRequests
        );
    }, [user?.uid]);

    const unasweredFriendRequests = friendRequests.filter(
        (req) =>
            req.to === user?.uid &&
            !req.accepted &&
            !req.rejected &&
            !req.deleted
    );

    return (
        <FriendsContext.Provider
            value={{
                friends,
                friendRequests: friendRequests.filter((fr) => !fr.deleted),
                unasweredFriendRequests,
            }}
        >
            {children}
        </FriendsContext.Provider>
    );
}

function useFriends() {
    const context = useContext(FriendsContext);

    if (!context)
        throw new Error("useFriends must be used within a FriendsProvider");

    return context;
}

export { FriendsContext, FriendsProvider, useFriends };
