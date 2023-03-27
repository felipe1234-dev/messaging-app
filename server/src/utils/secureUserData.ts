import { User } from "messaging-app-globals";

function secureUserData(user: User): User {
    delete user.token;
    user.salt = "";
    user.password = "";
    delete user.refreshToken;
    delete user.recoveryToken;
    delete user.rememberMeToken;

    return user;
}

export default secureUserData;