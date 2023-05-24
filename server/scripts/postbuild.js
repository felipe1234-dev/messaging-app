const fs = require("fs");
const path = require("path");

const pathTotsconfig = path.join(__dirname, "../tsconfig.json");
const tsconfig = JSON.parse(fs.readFileSync(pathTotsconfig, "utf8"));

const pathToBuild = path.join(
    __dirname,
    `../${tsconfig.compilerOptions.outDir}`
);
const builtFilesPaths = walk(pathToBuild);

for (const filepath of builtFilesPaths) {
    const isJSFile = filepath.endsWith(".js");
    if (!isJSFile) continue;

    resolvePathAliases(filepath, tsconfig);
}

/**
 * Lists all files in the given directory recursively
 * @param {string} dir
 * @param {string[]=} files
 * @returns {string[]}
 */
function walk(dir, files = []) {
    const dirFiles = fs.readdirSync(dir);

    for (const filename of dirFiles) {
        const stat = fs.lstatSync(dir + path.sep + filename);

        if (stat.isDirectory()) {
            walk(dir + path.sep + filename, files);
        } else {
            files.push(dir + path.sep + filename);
        }
    }

    return files;
}

/**
 * @param {string} filepath
 * @param {any} tsconfig
 */
function resolvePathAliases(filepath, tsconfig) {
    const content = fs.readFileSync(filepath, "utf8");

    const pathAliasesResolved = content.replace(
        /require\(['"]([^'"]+)['"]\)/g,
        (match, matchedPath) => {
            let resolvedPath = matchedPath;
            const baseUrl = tsconfig.compilerOptions.baseUrl;
            const buildUrl = tsconfig.compilerOptions.outDir;

            for (let [glob, replacement] of Object.entries(
                tsconfig.compilerOptions.paths
            )) {
                let group = 0;

                const pattern = globToRegexp(glob);
                replacement = replacement[0];
                replacement = replacement.replace(/\*/g, () => {
                    group++;
                    return `\$${group}`;
                });
                replacement = path.join(baseUrl, replacement);

                resolvedPath = resolvedPath.replace(pattern, replacement);
            }

            resolvedPath = resolvedPath.replace("src", buildUrl);
            resolvedPath = path.resolve(__dirname, `../${resolvedPath}`);

            const isImportable =
                fs.existsSync(resolvedPath) ||
                fs.existsSync(resolvedPath + ".js");
            if (!isImportable) return match;

            let relativePath = path.relative(
                path.dirname(filepath),
                resolvedPath
            );
            if (!relativePath.startsWith("./"))
                relativePath = "./" + relativePath;

            return `require("${relativePath}")`;
        }
    );

    fs.writeFileSync(filepath, pathAliasesResolved, "utf8");
}

function globToRegexp(glob, opts) {
    if (typeof glob !== "string") {
        throw new TypeError("Expected a string");
    }

    var str = String(glob);

    // The regexp we are building, as a string.
    var reStr = "";

    // Whether we are matching so called "extended" globs (like bash) and should
    // support single character matching, matching ranges of characters, group
    // matching, etc.
    var extended = opts ? !!opts.extended : false;

    // When globstar is _false_ (default), '/foo/*' is translated a regexp like
    // '^\/foo\/.*$' which will match any string beginning with '/foo/'
    // When globstar is _true_, '/foo/*' is translated to regexp like
    // '^\/foo\/[^/]*$' which will match any string beginning with '/foo/' BUT
    // which does not have a '/' to the right of it.
    // E.g. with '/foo/*' these will match: '/foo/bar', '/foo/bar.txt' but
    // these will not '/foo/bar/baz', '/foo/bar/baz.txt'
    // Lastely, when globstar is _true_, '/foo/**' is equivelant to '/foo/*' when
    // globstar is _false_
    var globstar = opts ? !!opts.globstar : false;

    // If we are doing extended matching, this boolean is true when we are inside
    // a group (eg {*.html,*.js}), and false otherwise.
    var inGroup = false;

    // RegExp flags (eg "i" ) to pass in to RegExp constructor.
    var flags = opts && typeof opts.flags === "string" ? opts.flags : "";

    var c;
    for (var i = 0, len = str.length; i < len; i++) {
        c = str[i];

        switch (c) {
            case "/":
            case "$":
            case "^":
            case "+":
            case ".":
            case "(":
            case ")":
            case "=":
            case "!":
            case "|":
                reStr += "\\" + c;
                break;

            case "?":
                if (extended) {
                    reStr += ".";
                    break;
                }

            case "[":
            case "]":
                if (extended) {
                    reStr += c;
                    break;
                }

            case "{":
                if (extended) {
                    inGroup = true;
                    reStr += "(";
                    break;
                }

            case "}":
                if (extended) {
                    inGroup = false;
                    reStr += ")";
                    break;
                }

            case ",":
                if (inGroup) {
                    reStr += "|";
                    break;
                }
                reStr += "\\" + c;
                break;

            case "*":
                // Move over all consecutive "*"'s.
                // Also store the previous and next characters
                var prevChar = str[i - 1];
                var starCount = 1;
                while (str[i + 1] === "*") {
                    starCount++;
                    i++;
                }
                var nextChar = str[i + 1];

                if (!globstar) {
                    // globstar is disabled, so treat any number of "*" as one
                    reStr += "(.*)";
                } else {
                    // globstar is enabled, so determine if this is a globstar segment
                    var isGlobstar =
                        starCount > 1 && // multiple "*"'s
                        (prevChar === "/" || prevChar === undefined) && // from the start of the segment
                        (nextChar === "/" || nextChar === undefined); // to the end of the segment

                    if (isGlobstar) {
                        // it's a globstar, so match zero or more path segments
                        reStr += "((?:[^/]*(?:/|$))*)";
                        i++; // move over the "/"
                    } else {
                        // it's not a globstar, so only match one path segment
                        reStr += "([^/]*)";
                    }
                }
                break;

            default:
                reStr += c;
        }
    }

    // When regexp 'g' flag is specified don't
    // constrain the regular expression with ^ & $
    if (!flags || !~flags.indexOf("g")) {
        reStr = "^" + reStr + "$";
    }

    return new RegExp(reStr, flags);
}
