/**
 * Server that calls controllers based on the route
 */
import * as http from "http"
import * as url from "url"
import * as path from "path"
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");

// const routes = require("../../config/routes.json")


class Server {
    private routes
    public httpServer: http.Server
    private controllers: string
    constructor(controllerPath: string, routes) {
        this.controllers = controllerPath
        this.routes = routes
        console.log("this outer", this)
        this.httpServer = http.createServer(this.handle.bind(this))
    }

    start(port: number) {
        try {
            this.httpServer.listen(port)
            console.log(`Server started on port ${port}.`)
        } catch (e) {
            console.error("Error opening server on port", port)
        }

    }

    stop() {
        this.httpServer.close()
    }

    handle(req: http.IncomingMessage, res: http.ServerResponse) {
        // parse URL
        const parsedUrl = url.parse(req.url);
        // extract URL path
        // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
        // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
        // by limiting the path to current directory only
        const sanitizedPath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');

        console.log(`sp: ${sanitizedPath},`)

        let pathToMatch = path.parse(sanitizedPath)

        let foundController = false;
        console.log("ligma", this.routes)
        this.routes.routes.forEach(route => {
            let matcher = match(route.path, { decode: decodeURIComponent })
            let paramaters = matcher(parsedUrl.pathname)
            if (paramaters) {
                foundController = true;
                console.log(paramaters.params)
                console.log(`Should use controller '${route.controller}'.`)
                let finder = route.controller.split('.')
                let p = path.join(this.controllers, finder[0])
                let controller = require(p)[finder[1]]
                console.log(controller)
                controller(req, res, paramaters.params)

                return
            }
        });
        if (!foundController) {
            console.error("404 bitch")
        }

        res.end(JSON.stringify(parsedUrl))
    }
}

export { Server }