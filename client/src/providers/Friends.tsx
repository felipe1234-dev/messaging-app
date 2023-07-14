import React, { createContext, useState, useEffect, useContext } from "react";
import { User as Friend, FriendRequest } from "messaging-app-globals";
import { useAuth } from "./Auth";
import { Api } from "@services";

interface FriendsValue {
    friends: Friend[];
    friendRequests: FriendRequest[];
}

const FriendsContext = createContext<FriendsValue>({
    friends: [],
    friendRequests: [],
});

function FriendsProvider({ children }: { children: React.ReactNode }) {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const { user } = useAuth();

    const fetchFriends = async () => {
        setFriends(
            (await Api.friends.list()).sort((a, b) => {
                if (a.online && !b.online) return -1;
                if (b.online && !a.online) return 1;

                if (a.online && b.online && a.sessionStart && b.sessionStart) {
                    if (a.sessionStart > b.sessionStart) return -1;
                    if (a.sessionStart < b.sessionStart) return 1;
                }

                if (!a.online && !b.online && a.sessionEnd && b.sessionEnd) {
                    if (a.sessionEnd > b.sessionEnd) return -1;
                    if (a.sessionEnd < b.sessionEnd) return 1;
                }

                return 0;
            })
        );
    };

    const fetchFriendRequests = async () => {
        setFriendRequests(await Api.friendRequests.list());
    };

    const onFriendUpdated = (updatedFriend: Friend) => {
        setFriends((prev) =>
            prev.map((friend) => {
                if (friend.uid === updatedFriend.uid) return updatedFriend;
                return friend;
            })
        );
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

    useEffect(() => {
        if (!user?.uid) return;

        fetchFriends();
        fetchFriendRequests();

        Api.friends.onFriendListUpdated(user.uid, onFriendUpdated);
        Api.friendRequests.onFriendRequestReceived(
            user.uid,
            onUpdateFriendRequests
        );
        Api.friendRequests.onFriendRequestSent(
            user.uid,
            onUpdateFriendRequests
        );
        Api.friendRequests.onFriendRequestUpdated(
            user.uid,
            onUpdateFriendRequests
        );
    }, [user?.uid, user?.friends]);

    return (
        <FriendsContext.Provider
            value={{
                friends,
                friendRequests: friendRequests.filter(
                    (friendRequest) => !friendRequest.deleted
                ),
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
