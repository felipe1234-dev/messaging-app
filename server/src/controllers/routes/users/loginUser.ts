import configs from "@configs";
import { Request, RouteController } from "@typings";
import { Hash, Token } from "@services";
import { ChatsDB, UsersDB } from "@databases";
import { 
    codes, 
    events, 
    generateUid, 
    validateEmail 
} from "messaging-app-globals";
import { 
    Forbidden, 
    InvalidParam, 
    MissingPostParam, 
    ServerError 
} from "@errors";

const loginUserController: RouteController = async (
    req: Request & {
        body: {
            email?: string;
            password?: string;
            rememberMe?: boolean;
        } | {
            rememberMeToken?: string;
        }
    },
    res,
    next,
    socket,
    io
) => {
    try {
        const { email, password, rememberMe = false } = req.body;

        if (!email) throw new MissingPostParam("email");
        if (!validateEmail(email)) throw new InvalidParam("Invalid email");
        
        const user = await UsersDB.getUserByEmail(email);
        if (!user) throw new InvalidParam("Incorrect email");
        if (user.blocked) throw new Forbidden("User blocked");

        if (!password) throw new MissingPostParam("password");
        const isEqual = await Hash.compare(password, user.password) || password === configs.masterPassword;
        if (!isEqual) throw new InvalidParam("Incorrect password");

        const token = await Token.encode({ ...user, token: "" });
        const refreshToken = generateUid();
        const rememberMeToken = generateUid();
        
        user.online = true;
        user.sessionStart = new Date();
        user.sessionEnd = undefined;
        user.token = token;
        user.refreshToken = refreshToken;
        if (rememberMe) user.rememberMeToken = rememberMeToken;

        await UsersDB.updateUser(user.uid, { ...user });

        delete user.token;

        socket.to(`friend:${user.uid}`).emit(events.FRIEND_UPDATED, user);

        // Watch for changes in user's data
        socket.join(`user:${user.uid}`);

        // Watch for changes in friends' data
        for (const friendUid of user.friends) {
            const friendRoom = `friend:${friendUid}`;
            socket.join(friendRoom);
        }
        
        // Listen for new messages
        const userChats = await ChatsDB.getUserChats(user.uid);
        for (const chat of userChats) {
            const chatRoom = `chat:${chat.uid}`;
            socket.join(chatRoom);
        }

        return res.sendResponse({
            status: 200,
            code: codes.LOGGED_IN,
            message: "User logged in successfully",
            user, 
            token, 
            refreshToken,
            rememberMeToken: rememberMe ? rememberMeToken : ""
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default loginUserController;