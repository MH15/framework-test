class Startup {
    public static main(): number {
        console.log('Hello World');
        return 0;
    }
}

import { join } from "path"

/**
 * Config
 */
const PROJECT = join(__dirname, "..")


import { buildWatch } from './builder';
import { Server } from "./server/server";

const DIR_OUT = join(PROJECT, 'dist')
const DIR_SEARCH = join(PROJECT, 'components')

const DIR_ROOT = join(PROJECT, "components", "demo.component")


const routes = require(join(PROJECT, 'config', 'routes.json'))
// console.log(routes)


// buildWatch(DIR_OUT, DIR_SEARCH, DIR_ROOT)

class Framework {
    public appRoot: string
    private server: Server
    constructor(appRoot: string) {
        this.appRoot = appRoot
    }
    // TODO: build
    // TODO: buildWatch
    serve(port: number) {
        let routes = require(join(this.appRoot, "config", "routes.json"))
        console.log("TIT")
        console.log(routes)
        this.server = new Server(join(this.appRoot, "controllers"), routes)
        this.server.start(port)
    }
}

module.exports = Framework