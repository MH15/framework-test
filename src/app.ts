
import { existsSync, readdirSync, readFileSync } from 'fs';
import { ServerResponse } from "http";
import { join } from "path";
/**
 * Config
 */
import { combine, buildWatch } from './builder';
import { Component } from "./component";
import { Server } from "./server/server";
import { LiveServer } from './server/live-server';
const WebSocket = require("ws")




class Framework {
    // Directories and filepaths
    public appRoot: string
    public dirOut: string
    public dirSearch: string
    public developPath: string
    // Server object
    private server: Server
    // Component cache
    // TODO: make into Set<Component> instead of Array
    private componentCache = []
    private _debug = false

    constructor(appRoot: string, debug?: boolean) {
        this.appRoot = appRoot
        this.dirOut = join(this.appRoot, 'dist')
        this.dirSearch = join(this.appRoot, 'components')
        this.developPath = join(this.appRoot, "dist", "develop")
        if (debug) {
            this.debug = true
        }
    }

    /**
     * Change the current debug setting
     * TODO: reload server when this changes
     */
    set debug(state: boolean) {
        this._debug = state
    }

    get debug(): boolean {
        return this._debug
    }

    /**
     * Build a single component.
     * @param name 
     */
    buildComponent(name: string) {

        let component = this.locateComponent(name)
        component.build(this.dirOut, this.dirSearch)
        this.componentCache.push(component)
    }

    /**
     * Build all components in the appRoot/components directory
     */
    buildAllComponents() {
        readdirSync(this.dirSearch).forEach(function (file) {
            // let component = new Component(join(dirSearch, file))
            // component.build(dirOut, dirSearch)
            this.buildComponent(file.split(".")[0])
        }.bind(this))
    }


    /**
     * Render a component to the response.
     * @param res the server response object
     * @param name name of Component to render
     */
    render(res: ServerResponse, name: string) {
        let component = this.componentCache.find((c) => {
            return c.name === name
        })
        if (this.debug) {
            component.build(this.dirOut, this.dirSearch)
        }
        let content = combine(component, this.dirOut, this.dirSearch)
        res.writeHead(200)
        res.end(content)
    }

    private locateComponent(name: string): Component {
        let location = join(this.appRoot, 'components', name + '.component')
        if (existsSync(location)) {
            return new Component(location)
        } else {
            throw new Error(`Component named '${name}' does not exist.`)
        }
    }


    // private gatherComponentResources(name: string): { mustache: string, style } {
    //     let location = join(this.appRoot, 'dist', 'mustache', name + '.mustache')
    //     if (existsSync(location)) {
    //         let mustache = readFileSync(location)
    //     }
    // }

    // TODO: buildWatch
    serve(port: number) {
        let routes = require(join(this.appRoot, "config", "routes.json"))
        this.server = new Server(join(this.appRoot, "controllers"), routes)
        this.server.start(port)
    }


    async watch(name: string) {
        let pathToComponent = join(this.dirSearch, `${name}.component`)
        let liveServer = new LiveServer(this.developPath)
        await liveServer.start(8081)

        const wss = new WebSocket.Server({ port: 8089 })
        let connection
        wss.on('connection', (ws) => {
            ws.on('message', message => {
                console.log(`Received message => ${message}`)
            })
            ws.send('ho!')
            connection = ws
            buildWatch(this.dirOut, this.dirSearch, pathToComponent, connection)

        })
    }
}





function renderComponent(res: ServerResponse, name: string) {
    let componentPath = name
    if (existsSync(componentPath)) {
        let component = readFileSync(componentPath, "utf8")
        res.end(component)
    } else {
        console.error("Component not found ya thot")
    }
}

export { Framework, renderComponent };
