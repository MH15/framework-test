#!/usr/bin/env node

import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
import { buildWatch } from "./builder";
import { LiveServer } from './server/live-server';
import { newDir } from "./utils/file";
import { parsing } from "./utils/dom/parser";
const WebSocket = require("ws")

const commander = require('commander');
const program = new commander.Command();


let baseDir = process.cwd()


let component = `<template></template>

<style lang="scss">    
h1 {
    background: orange;
}
</style>

<script></script>
`
var copydir = require('copy-dir');

const version = require('../package.json').version


program.version(version)
    .option('-v, --version')

program.command('init')
    .description('Initialize a new project.')
    .action(() => {
        console.log("Creating all default files...")
        copydir.sync(join(__dirname, '..', 'default'), baseDir)
        console.log("   Done.")
        // TODO: make the rest of the default files
    })

/**
 * Create a new component or controller.
 */
program.command('create <type> <name>')
    .description('Create a new component or controller')
    .action((type: string, name) => {
        console.log(`Creating a new ${type.toLowerCase()}.`)
        switch (type.toLowerCase()) {
            case 'component':
                let dirComponents = join(baseDir, 'components')
                console.log("DIRRR", dirComponents)
                newDir(dirComponents)
                writeFileSync(join(dirComponents, name + ".component"), component)
                break;
            case 'controller':
                throw new Error('Controller creation not yet implemented.')
            default:
                console.error("That's not a valid creation type.")
        }
    })
/**
 * Develop a component
 */
program.command('develop <name>')
    .description('Develop a component using the live server.')
    .action(async (name) => {
        const DIR_OUT = join(baseDir, 'dist')
        const DIR_SEARCH = join(baseDir, 'components')
        const DIR_ROOT = join(baseDir, "components", `${name}.component`)
        const DEVELOP_ROOT = join(baseDir, "dist", "develop")

        // TODO: combine LiveServer and WebSocketController into one class that extends Server
        let liveServer = new LiveServer(DEVELOP_ROOT)
        await liveServer.start(8081)

        console.log("starting liveserver")

        const wss = new WebSocket.Server({ port: 8089 })
        let connection
        wss.on('connection', (ws) => {
            ws.on('message', message => {
                // console.log(`Received message => ${message}`)
            })
            ws.send('ho!')
            connection = ws
            buildWatch(DIR_OUT, DIR_SEARCH, DIR_ROOT, connection)

        });


    })

program.command('parse <name>')
    .description('Parse a component using the new parser')
    .action(async (name) => {
        const DIR_OUT = join(baseDir, 'dist')
        const DIR_SEARCH = join(baseDir, 'components')
        const DIR_ROOT = join(baseDir, "components", `${name}.component`)
        const DEVELOP_ROOT = join(baseDir, "dist", "develop")

        let file = readFileSync(join(DIR_SEARCH, name + ".component"), "utf8")
        // console.log(file)
        parsing(file)

    })


program.parse(process.argv)

