"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.watch = fs_1.watch;
/**
 * Call the cb Function each time the file at path is changed.
 * @param {String} path
 * @param {Function} cb
 */
// function watch(path, cb) {
//     let fsWait = false;
//     watch(path, (event, filename) => {
//         if (filename) {
//             if (fsWait) return;
//             setTimeout(() => {
//                 fsWait = false;
//             }, 100);
//             console.log(`${filename} file Changed`);
//             cb()
//         }
//     });
// }
function fileExists(path) {
    if (!fs_1.existsSync(path)) {
        return true;
    }
    return false;
}
exports.fileExists = fileExists;
//# sourceMappingURL=file.js.map