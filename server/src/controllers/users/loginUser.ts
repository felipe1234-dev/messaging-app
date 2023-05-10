import configs from "@configs";
import { Request, RouteController } from "@typings";
import { Hash, Token } from "@services";
import { UsersDB } from "@databases";
import { secureUserData } from "@utils";
import { 
    codes,
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
    res
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

        const token = await Token.encode(user);
        const refreshToken = generateUid();
        const rememberMeToken = generateUid();
        
        user.online = true;
        user.sessionStart = new Date();
        user.sessionEnd = undefined;
        user.token = token;
        user.refreshToken = refreshToken;
        if (rememberMe) user.rememberMeToken = rememberMeToken;

        await UsersDB.updateUser(user.uid, { ...user });

        return res.sendResponse({
            status: 200,
            code: codes.LOGGED_IN,
            message: "User logged in successfully",
            user: secureUserData(user), 
            token,
            refreshToken,
            rememberMeToken: rememberMe ? rememberMeToken : ""
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default loginUserController;