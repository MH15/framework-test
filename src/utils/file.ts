
import { watch, existsSync } from "fs"
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


function fileExists(path: string) {
    if (!existsSync(path)) {
        return true
    }
    return false
}


export { watch, fileExists }