function hex2(c: number): string {
    c = Math.round(c);

    if (c < 0) c = 0;
    if (c > 255) c = 255;

    let s = c.toString(16);
    if (s.length < 2) s = "0" + s;

    return s;
}

function toHexString(r: number, g: number, b: number): string {
    return "#" + hex2(r) + hex2(g) + hex2(b);
}

function shade(color: string, light: number): string {
    if (light < -1) light = -1;
    if (light > 1) light = 1;

    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);

    if (light < 0) {
        r = (1 + light) * r;
        g = (1 + light) * g;
        b = (1 + light) * b;
    } else {
        r = (1 - light) * r + light * 255;
        g = (1 - light) * g + light * 255;
        b = (1 - light) * b + light * 255;
    }

    return toHexString(r, g, b);
}

export default shade;
