"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.watch = fs_1.watch;
function makeDirs(dirs) {
    dirs.forEach(dir => {
        fs_1.mkdirSync(dir, { recursive: true });
    });
}
exports.makeDirs = makeDirs;
function fileExists(path) {
    if (!fs_1.existsSync(path)) {
        return true;
    }
    return false;
}
exports.fileExists = fileExists;
//# sourceMappingURL=file.js.map