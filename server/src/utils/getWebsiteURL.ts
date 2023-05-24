import isLocal from "./isLocal";

function getWebsiteURL() {
    return isLocal() ? "http://localhost:3000/" : "";
}

export default getWebsiteURL;
