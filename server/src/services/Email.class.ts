import nodemailer from "nodemailer";
import configs from "@configs";

const transporter = nodemailer.createTransport(configs.email);

class Email {
    public static send(options: {
        from?: string;
        to: string[] | string;
        subject: string;
        html: string;
    }) {
        if (!options.from) options.from = configs.email.auth.user;
        if (Array.isArray(options.to)) options.to = options.to.join(", "); 
        
        return transporter.sendMail(options);
    }
}

export default Email;