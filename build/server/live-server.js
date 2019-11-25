"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const path = require("path");
const server_1 = require("./server");
const fs = require("fs");
const WebSocket = require("ws");
const Mustache = require("mustache");
class LiveServer extends server_1.Server {
    constructor(developPath) {
        super("", {});
        this.developPath = developPath;
    }
    start(port) {
        return new Promise((resolve, reject) => {
            try {
                this.httpServer.listen(port);
                console.log(`Server started on port ${port}.`);
                resolve();
            }
            catch (e) {
                console.error("Error opening server on port", port);
                reject();
            }
        });
    }
    handle(req, res) {
        const parsedUrl = url.parse(req.url);
        const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
        let pathname = path.join(process.cwd(), "dist", "develop", sanitizePath);
        fs.exists(pathname, function (exist) {
            if (!exist) {
                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }
            /**
             * Build develop.ejs and send to localhost:8081/
             * serve paths for static at /components/name/style.css|script.js
             */
            // if is a directory, then look for index.html
            if (fs.statSync(pathname).isDirectory()) {
                // pathname += '/index.html';
                pathname += '/index.html';
                let p = path.join(process.cwd(), "dist", "develop", "develop.mustache");
                let developHTML = Mustache.render(fs.readFileSync(p, "utf8"), {
                    name: "bitch",
                    type: "componentz",
                    source: "temp.html"
                });
                res.setHeader('Content-type', mimeType[".html"] || 'text/plain');
                res.end(developHTML);
            }
            else {
                // read file from file system
                fs.readFile(pathname, function (err, data) {
                    if (err) {
                        res.statusCode = 500;
                        res.end(`Error getting the file: ${err}.`);
                    }
                    else {
                        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                        const ext = path.parse(pathname).ext;
                        // if the file is found, set Content-type and send data
                        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                        res.end(data);
                    }
                });
            }
        });
    }
    restart(wssocket) {
        console.log("Reloading server.");
        // this.wss.send('reload')
    }
}
exports.LiveServer = LiveServer;
class WebSocketController {
    constructor(port) {
        this.port = port;
        this.socket = new WebSocket.Server({ port: port });
        this.socket.on('connection', function (ws) {
            this.wss = ws;
            ws.on('message', message => {
                // console.log(`Received message => ${message}`)
            });
            ws.send('ho!');
        });
    }
    restart() {
        if (this.wss) {
            this.wss.send("reload");
        }
        else {
            console.error("failed to set up ws maybe");
        }
    }
}
exports.WebSocketController = WebSocketController;
// maps file extention to MIME types
const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};
//# sourceMappingURL=live-server.js.map