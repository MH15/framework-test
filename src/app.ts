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

// Startup.main();


interface Template {

}



import { buildWatch } from './builder';
import { Server } from "./server/server";

const DIR_OUT = join(PROJECT, 'dist')
const DIR_SEARCH = join(PROJECT, 'components')

const DIR_ROOT = join(PROJECT, "components", "demo.component")


const routes = require(join(PROJECT, 'config', 'routes.json'))
// console.log(routes)


// buildWatch(DIR_OUT, DIR_SEARCH, DIR_ROOT)

let server = new Server()
server.start(8000)