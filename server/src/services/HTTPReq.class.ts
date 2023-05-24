import { ResponseType } from "@typings";
import axios from "axios";

interface Configs {
    headers?: { [key: string]: string };
    responseType?: ResponseType;
    body?: any;
    timeout?: number;
}

class HTTPReq {
    static async get(url: string, configs?: Configs) {
        const resp = await axios.get(url, configs);
        return resp.data;
    }

    static async post(url: string, configs: Configs = {}) {
        const { body = {}, ...rest } = configs;
        const resp = await axios.post(url, body, rest);
        return resp.data;
    }
}

export default HTTPReq;
