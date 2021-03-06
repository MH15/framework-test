"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Server that calls controllers based on the route
 */
const http = require("http");
const url = require("url");
const path = require("path");
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
// const routes = require("../../config/routes.json")
class Server {
    constructor(controllerPath, routes) {
        this.controllers = controllerPath;
        this.routes = routes;
        this.httpServer = http.createServer(this.handle.bind(this));
    }
    start(port) {
        try {
            this.httpServer.listen(port);
            console.log(`Server started on port ${port}.`);
        }
        catch (e) {
            console.error("Error opening server on port", port);
        }
    }
    stop() {
        this.httpServer.close();
    }
    handle(req, res) {
        // parse URL
        const parsedUrl = url.parse(req.url);
        // extract URL path
        // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
        // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
        // by limiting the path to current directory only
        const sanitizedPath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
        console.log(`sp: ${sanitizedPath},`);
        let pathToMatch = path.parse(sanitizedPath);
        let foundController = false;
        this.routes.routes.forEach(route => {
            let matcher = match(route.path, { decode: decodeURIComponent });
            let paramaters = matcher(parsedUrl.pathname);
            if (paramaters) {
                foundController = true;
                console.log(paramaters.params);
                console.log(`Should use controller '${route.controller}'.`);
                let finder = route.controller.split('.');
                let p = path.join(this.controllers, finder[0]);
                let controller = require(p)[finder[1]];
                controller(req, res, paramaters.params);
                return;
            }
        });
        if (!foundController) {
            console.error("404 bitch");
        }
        res.end(JSON.stringify(parsedUrl));
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map