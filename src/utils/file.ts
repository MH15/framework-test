
import { watch, existsSync, mkdirSync } from "fs"


function makeDirs(dirs: string[]) {
    dirs.forEach(dir => {
        mkdirSync(dir, { recursive: true })
    })
}

function fileExists(path: string) {
    if (!existsSync(path)) {
        return true
    }
    return false
}

function newDir(dir: string) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}


export { watch, fileExists, makeDirs, newDir }