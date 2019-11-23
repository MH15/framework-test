"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Server that calls controllers based on the route
 */
const http = require("http");
const url = require("url");
const path = require("path");
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
const routes = require("../../config/routes.json");
class Server {
    constructor() {
        this.server = http.createServer(this.handle);
    }
    start(port) {
        this.server.listen(port);
    }
    stop() {
        this.server.close();
    }
    handle(req, res) {
        // const parsedURL = parse(req.url)
        // console.log(parsedURL)
        // const sanitizePath = normalize(parsedURL.pathname).replace(/^(\.\.[\/\\])+/, '');
        // console.log(sanitizePath)
        // parse URL
        const parsedUrl = url.parse(req.url);
        // extract URL path
        // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
        // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
        // by limiting the path to current directory only
        const sanitizedPath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
        // let pathname = path.join(__dirname, "../..", "_build", type, name, sanitizePath);
        // let pathname = path.join(__dirname, "../..", "_build", sanitizePath);
        console.log(`sp: ${sanitizedPath},`);
        let pathToMatch = path.parse(sanitizedPath);
        routes.routes.forEach(route => {
            let matcher = match(route.path, { decode: decodeURIComponent });
            let paramaters = matcher(parsedUrl.pathname);
            if (paramaters) {
                console.log(`Should use controller '${route.controller}'.`);
            }
        });
        let k = [];
        let m = match("/test/:id", { decode: decodeURIComponent });
        console.log(sanitizedPath, parsedUrl.pathname);
        console.log(m(parsedUrl.pathname));
        console.log(m("/test/a"));
        res.end(JSON.stringify(parsedUrl));
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map