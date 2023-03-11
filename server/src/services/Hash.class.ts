import bcrypt from "bcrypt";

class Hash {
    public static async create(str: string, salt: string): Promise<string> {
        const hashedStr = await bcrypt.hash(str, salt);
        return hashedStr;
    }

    public static async compare(str: string, hash: string): Promise<boolean> {
        const match = await bcrypt.compare(str, hash);
        return match;
    }

    public static async generateSalt(rounds?: number): Promise<string> {
        const salt = await bcrypt.genSalt(rounds);
        return salt;
    }
}

export default Hash;