import { User, events } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { Token } from "@services";
import * as socketIo from "socket.io";

let expiresInExecutions = 0;

async function expireTokens(io: socketIo.Server) {
    if (expiresInExecutions > 0) return;
    
    expiresInExecutions++;

    const onlineUsers = await UsersDB.getUsers({
        wheres: [
            ["online", "==", true]
        ]
    });

    const logoutUser = async (user: User) => {
        await UsersDB.updateUser(user.uid, {
            online: false,
            sessionEnd: new Date(),
            token: ""
        });
        
        const updatedUser = await UsersDB.getUserByUid(user.uid);
        io.to(`user:${user.uid}`).emit(events.USER_UPDATED, updatedUser);
        io.to(`friend:${user.uid}`).emit(events.FRIEND_UPDATED, updatedUser);
    };

    for (const user of onlineUsers) {
        if (!user.token) {
            await logoutUser(user);
            continue;
        }

        if (await Token.isExpired(user.token)) {
            await logoutUser(user);
        }
    }

    expiresInExecutions = 0;
}

export default expireTokens;