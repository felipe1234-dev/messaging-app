import { User } from "messaging-app-globals";

function secureUserData(user: User): User {
    const secureUser = new User(user);

    delete secureUser.token;
    secureUser.salt = "";
    secureUser.password = "";
    delete secureUser.refreshToken;
    delete secureUser.recoveryToken;
    delete secureUser.rememberMeToken;

    return secureUser;
}

export default secureUserData;