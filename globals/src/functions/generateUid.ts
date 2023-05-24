const randInterval = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

const generateUid = (prefix = "", size = Infinity) => {
    let date = new Date();
    let rand = () => Math.floor(Math.random() * 3000) + 1;
    let a = date.getTime().toString(16);

    date.setDate(date.getDate() + rand());
    let b = date.getTime().toString(16);

    date.setDate(date.getDate() + rand());
    let c = date.getTime().toString(16);

    date.setDate(date.getDate() + rand());
    let d = date.getTime().toString(16);

    date.setDate(date.getDate() + rand());
    let e = date.getTime().toString(16);

    let f = prefix + a + b + c + d + e;
    let length = f.length;

    for (let i = 0; i < length - 5; i++) {
        let index = randInterval(0, length);
        f =
            f.substr(0, index) +
            f.substr(index, 1).toUpperCase() +
            f.substr(index + 1);
    }

    return f.slice(0, size);
};

export default generateUid;
