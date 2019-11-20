"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Startup {
    static main() {
        console.log('Hello World');
        return 0;
    }
}
Startup.main();
const component_1 = require("./component");
const path_1 = require("path");
let component = new component_1.Component(path_1.join(__dirname, '..', 'components', 'demo.component'));
console.log(component);
component.build();
console.log(component);
