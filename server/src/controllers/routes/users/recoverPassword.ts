import { RouteController, Request } from "@typings";
import { 
    MissingURLParam, 
    NotFound, 
    ServerError
} from "@errors";
import { UsersDB } from "@databases";
import { Email } from "@services";
import { emailTemplates } from "@utils";
import { codes, events, generateUid } from "messaging-app-globals";

const recoverPasswordController: RouteController = async (
    req: Request & {
        params: {
            userUid?: string;
        }
    },
    res,
    next,
    socket,
    io
) => {
    try {
        const { userUid } = req.params;
        if (!userUid) throw new MissingURLParam("userUid");

        const user = await UsersDB.getUserByUid(userUid);
        if (!user) throw new NotFound("User not found");

        const recoveryToken = generateUid("", 15);
        await UsersDB.updateUser(userUid, { recoveryToken });

        const updatedUser = await UsersDB.getUserByUid(userUid);
        io.to(`user:${userUid}`).emit(events.USER_UPDATED, updatedUser);
    
        await Email.send({
            to: user.email,
            subject: "Password recovery",
            html: emailTemplates.passwordRecovery({ recoveryToken })
        });

        return res.sendResponse({
            status: 200,
            code: codes.PASSWORD_RECOVERY_SENT,
            message: "Password recovery email sent successfully"
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
}

export default recoverPasswordController;