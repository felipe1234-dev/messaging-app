import mime from "mime-types";

function getFileMimetype(filename: string) {
    const mimetype = mime.lookup(filename);
    return mimetype !== false ? mimetype : "";
}

export default getFileMimetype;
