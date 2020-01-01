"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Config
 */
const builder_1 = require("./builder");
const component_1 = require("./component");
const server_1 = require("./server/server");
const live_server_1 = require("./server/live-server");
const WebSocket = require("ws");
class Framework {
    constructor(appRoot, debug) {
        // Component cache
        // TODO: make into Set<Component> instead of Array
        this.componentCache = [];
        this._debug = false;
        this.appRoot = appRoot;
        this.dirOut = path_1.join(this.appRoot, 'dist');
        this.dirSearch = path_1.join(this.appRoot, 'components');
        this.developPath = path_1.join(this.appRoot, "dist", "develop");
        if (debug) {
            this.debug = true;
        }
    }
    /**
     * Change the current debug setting
     * TODO: reload server when this changes
     */
    set debug(state) {
        this._debug = state;
    }
    get debug() {
        return this._debug;
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
        // let component = this.componentCache.find((c) => {
        //     return c.name === name
        // })
        // if (this.debug) {
        //     component.build(this.dirOut, this.dirSearch)
        // }
        let data = {
            test: "frank",
            ha: {
                alpha: "h.alphaaa"
            }
        };
        let component = this.locateComponent(name);
        console.log("found:", component);
        component.assemble(data, this.dirSearch);
        let content = builder_1.combine(component);
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
        this.server = new server_1.Server(path_1.join(this.appRoot, "controllers"), routes);
        this.server.start(port);
    }
    watch(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let pathToComponent = path_1.join(this.dirSearch, `${name}.component`);
            let liveServer = new live_server_1.LiveServer(this.developPath);
            yield liveServer.start(8081);
            const wss = new WebSocket.Server({ port: 8089 });
            let connection;
            wss.on('connection', (ws) => {
                ws.on('message', message => {
                    console.log(`Received message => ${message}`);
                });
                ws.send('ho!');
                connection = ws;
                builder_1.buildWatch(data, this.dirOut, this.dirSearch, pathToComponent, connection);
            });
        });
    }
}
exports.Framework = Framework;
function renderComponent(res, name) {
    let componentPath = name;
    if (fs_1.existsSync(componentPath)) {
        let component = fs_1.readFileSync(componentPath, "utf8");
        res.end(component);
    }
    else {
        console.error("Component not found ya thot");
    }
}
exports.renderComponent = renderComponent;
//# sourceMappingURL=app.js.map