class Startup {
    public static main(): number {
        console.log('Hello World');
        return 0;
    }
}

Startup.main();


interface Template {

}

import { join } from "path"
import { buildWatch } from './builder';

const DIR_OUT = join(__dirname, '..', 'dist')
const DIR_SEARCH = join(__dirname, '..', 'components')

const DIR_ROOT = join(__dirname, "..", "components", "demo.component")

buildWatch(DIR_OUT, DIR_SEARCH, DIR_ROOT)