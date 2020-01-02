/**
 * Server that reloads on change. For testing purposed only.
 */
import * as http from "http"
import * as url from "url"
import * as path from "path"
import { Server } from "./server"
import * as fs from "fs"

import * as WebSocket from "ws"
import { resolve } from "dns"

const ejs = require("ejs")

export class LiveServer extends Server {
    private developPath: string
    private socket: any
    private sampleData: object

    constructor(developPath: string) {
        super("", {})
        this.developPath = developPath
        this.sampleData = {}
    }

    /**
     * Change the data that is given to the current template
     * @param data: the object to be rendered with the current component
     */
    changeSampleData(data: object) {
        this.sampleData = data
        // TODO: reload server to use this new data
    }

    start(port: number) {
        return new Promise((resolve, reject) => {
            try {
                this.httpServer.listen(port)
                console.log(`Server started on port ${port}.`)

                resolve()
            } catch (e) {
                console.error("Error opening server on port", port)
                reject()
            }
        })


    }

    handle(req: http.IncomingMessage, res: http.ServerResponse) {
        const parsedUrl = url.parse(req.url)
        const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '')
        let pathname = path.join(process.cwd(), "dist", "develop", sanitizePath)

        fs.exists(pathname, function (exist) {
            if (!exist) {
                res.statusCode = 404
                res.end(`File ${pathname} not found!`)
                return
            }

            /**
             * Build develop.ejs and send to localhost:8081/
             * serve paths for static at /components/name/style.css|script.js
             */
            // if is a directory, then look for index.html
            if (fs.statSync(pathname).isDirectory()) {
                // pathname += '/index.html';
                pathname += '/index.html'
                let p = path.join(process.cwd(), "dist", "develop", "develop.ejs")
                // let developHTML = Mustache.render(fs.readFileSync(p, "utf8"), {
                //     name: "bitch",
                //     type: "componentz",
                //     source: "temp.html"
                // })

                // let developHTML = template.render(name, content)
                // TODO: write a method to render the final component
                let developHTML = ejs.render(fs.readFileSync(p, "utf8"), {
                    name: "test name",
                    type: "component",
                    source: "temp.html"
                })
                // console.log("DEV", developHTML)

                res.setHeader('Content-type', mimeType[".html"] || 'text/plain')

                res.end(developHTML)
            } else {
                // read file from file system
                fs.readFile(pathname, function (err, data) {
                    if (err) {
                        res.statusCode = 500
                        res.end(`Error getting the file: ${err}.`)
                    } else {
                        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                        const ext = path.parse(pathname).ext
                        // if the file is found, set Content-type and send data
                        res.setHeader('Content-type', mimeType[ext] || 'text/plain')
                        res.end(data)
                    }
                })
            }


        })
    }

    restart(wssocket) {
        console.log("Reloading server.")
        // this.wss.send('reload')
    }
}


export class WebSocketController {
    port: number
    socket: any
    wss: any
    constructor(port: number) {
        this.port = port
        this.socket = new WebSocket.Server({ port: port })
        this.socket.on('connection', function (ws: any) {
            this.wss = ws
            ws.on('message', message => {
                // console.log(`Received message => ${message}`)
            })
            ws.send('ho!')
        })
    }

    restart() {
        if (this.wss) {

            this.wss.send("reload")
        } else {
            console.error("failed to set up ws maybe")
        }
    }
}

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
}