import { Code } from '@typings/index';

class ServerError extends Error {
    public code: Code;
    public status: number;
  
    constructor(code: Code, message: string, status: number) {
        super(message);
        this.code = code;
        this.status = status;
    }
}
  

export default ServerError;