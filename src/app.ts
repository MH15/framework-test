class Startup {
    public static main(): number {
        console.log('Hello World');
        return 0;
    }
}

import { join } from "path"

/**
 * Config
 */
const PROJECT = join(__dirname, "..")


import { buildWatch, buildAll, combine } from './builder';
import { Server } from "./server/server";
import { ServerResponse } from "http";
import { fileExists } from "./utils/file";
import { readFileSync, existsSync, readdirSync } from 'fs';
import { Component } from "./component";



// console.log(routes)


// buildWatch(DIR_OUT, DIR_SEARCH, DIR_ROOT)

class Framework {
    // Directories and filepaths
    public appRoot: string
    public dirOut: string
    public dirSearch: string
    // Server object
    private server: Server
    // Component cache
    // TODO: make into Set<Component> instead of Array
    private componentCache = []
    private debug = false

    constructor(appRoot: string, debug?: boolean) {
        this.appRoot = appRoot
        this.dirOut = join(this.appRoot, 'dist')
        this.dirSearch = join(this.appRoot, 'components')
        if (debug) {
            this.debug = true
        }
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
        console.log("pre")
        let component = this.componentCache.find((c) => {
            return c.name === name
        })
        console.log("fouind", component.buildSet)
        if (this.debug) {
            console.log("REGBUILDING")
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
        console.log(routes)
        this.server = new Server(join(this.appRoot, "controllers"), routes)
        this.server.start(port)
    }
}





function renderComponent(res: ServerResponse, name: string) {
    let componentPath = name
    console.log("PATTTTTH", componentPath)
    if (existsSync(componentPath)) {
        let component = readFileSync(componentPath, "utf8")
        console.log(component)
        res.end(component)
    } else {
        console.error("Component not found ya thot")
    }
}

export { Framework, renderComponent }