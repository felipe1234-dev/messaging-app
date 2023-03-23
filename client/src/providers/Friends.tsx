import React, { 
    createContext, 
    useContext, 
    useEffect, 
    useState
} from "react";
import { User } from "messaging-app-globals";
import { useAuth } from "@providers";
import { useAsyncEffect, useUnmount } from "@hooks";
import { Api } from "@services";

interface ChatsValue {
    friends: User[];
}

const FriendsContext = createContext<ChatsValue | undefined>(undefined);

function FriendsProvider(props: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [friends, setFriends] = useState<User[]>([]);

    const onFriendUpdated = (updatedFriend: User) => {
        setFriends(prev => prev.map(friend => {
            if (friend.uid === updatedFriend.uid) return updatedFriend;
            return friend;
        }));
    };

    const onConnect = () => {
        Api.friends.onFriendUpdated(onFriendUpdated);
    };

    const onDisconnect = () => {
        Api.friends.offFriendUpdated(onFriendUpdated);
    };

    useEffect(() => {
        Api.onConnect(onConnect);
        Api.onDisconnect(onDisconnect);
    }, []);

    useUnmount(() => {
        Api.offConnect(onConnect);
        Api.offDisconnect(onDisconnect);
    });

    useAsyncEffect(async () => {
        if (!user) {
            setFriends([]);
        } else {
            const friendList = await Api.friends.getUserFriends();
            setFriends(friendList);
        }
    }, [user]);

    return (
        <FriendsContext.Provider
            value={{
                friends
            }}
        >
            {props.children}
        </FriendsContext.Provider>
    );
}

function useFriends() {
    const context = useContext(FriendsContext);

    if (!context) throw new Error("useFriends must be used within a FriendsProvider");

    return context;
}

export { FriendsProvider, useFriends, FriendsContext };