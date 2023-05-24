import { Request, RouteController } from "@typings";
import { codes, validateEmail } from "messaging-app-globals";
import { InvalidParam, MissingPostParam, ServerError } from "@errors";
import { Hash } from "@services";
import { User } from "messaging-app-globals";
import { UsersDB } from "@databases";

const registerUserController: RouteController = async (
    req: Request & {
        body: {
            name?: string;
            email?: string;
            password?: string;
        };
    },
    res
) => {
    try {
        const { name, email, password } = req.body;

        if (!name) throw new MissingPostParam("name");
        if (!email) throw new MissingPostParam("email");
        if (!validateEmail(email)) throw new InvalidParam("Invalid email");
        if (!password) throw new MissingPostParam("password");

        const userAlreadyExists = !!(await UsersDB.getUserByEmail(email));
        if (userAlreadyExists) throw new InvalidParam("Email already taken");

        const salt = await Hash.generateSalt(10);
        const hashedPassword = await Hash.create(password, salt);

        const newUser = new User({
            name,
            email,
            salt,
            password: hashedPassword,
        });

        await UsersDB.createUser(newUser);

        return res.sendResponse({
            status: 200,
            code: codes.USER_CREATED,
            message: "User created successfully",
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default registerUserController;
