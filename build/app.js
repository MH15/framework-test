"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Startup {
    static main() {
        console.log('Hello World');
        return 0;
    }
}
const path_1 = require("path");
/**
 * Config
 */
const PROJECT = path_1.join(__dirname, "..");
const builder_1 = require("./builder");
const server_1 = require("./server/server");
const fs_1 = require("fs");
const component_1 = require("./component");
// console.log(routes)
// buildWatch(DIR_OUT, DIR_SEARCH, DIR_ROOT)
class Framework {
    constructor(appRoot, debug) {
        // Component cache
        // TODO: make into Set<Component> instead of Array
        this.componentCache = [];
        this.debug = false;
        this.appRoot = appRoot;
        this.dirOut = path_1.join(this.appRoot, 'dist');
        this.dirSearch = path_1.join(this.appRoot, 'components');
        if (debug) {
            this.debug = true;
        }
    }
    /**
     * Build a single component.
     * @param name
     */
    buildComponent(name) {
        let component = this.locateComponent(name);
        component.build(this.dirOut, this.dirSearch);
        this.componentCache.push(component);
    }
    /**
     * Build all components in the appRoot/components directory
     */
    buildAllComponents() {
        fs_1.readdirSync(this.dirSearch).forEach(function (file) {
            // let component = new Component(join(dirSearch, file))
            // component.build(dirOut, dirSearch)
            this.buildComponent(file.split(".")[0]);
        }.bind(this));
    }
    /**
     * Render a component to the response.
     * @param res the server response object
     * @param name name of Component to render
     */
    render(res, name) {
        console.log("pre");
        let component = this.componentCache.find((c) => {
            return c.name === name;
        });
        console.log("fouind", component.buildSet);
        if (this.debug) {
            console.log("REGBUILDING");
            component.build(this.dirOut, this.dirSearch);
        }
        let content = builder_1.combine(component, this.dirOut, this.dirSearch);
        res.writeHead(200);
        res.end(content);
    }
    locateComponent(name) {
        let location = path_1.join(this.appRoot, 'components', name + '.component');
        if (fs_1.existsSync(location)) {
            return new component_1.Component(location);
        }
        else {
            throw new Error(`Component named '${name}' does not exist.`);
        }
    }
    // private gatherComponentResources(name: string): { mustache: string, style } {
    //     let location = join(this.appRoot, 'dist', 'mustache', name + '.mustache')
    //     if (existsSync(location)) {
    //         let mustache = readFileSync(location)
    //     }
    // }
    // TODO: buildWatch
    serve(port) {
        let routes = require(path_1.join(this.appRoot, "config", "routes.json"));
        console.log(routes);
        this.server = new server_1.Server(path_1.join(this.appRoot, "controllers"), routes);
        this.server.start(port);
    }
}
exports.Framework = Framework;
function renderComponent(res, name) {
    let componentPath = name;
    console.log("PATTTTTH", componentPath);
    if (fs_1.existsSync(componentPath)) {
        let component = fs_1.readFileSync(componentPath, "utf8");
        console.log(component);
        res.end(component);
    }
    else {
        console.error("Component not found ya thot");
    }
}
exports.renderComponent = renderComponent;
//# sourceMappingURL=app.js.map