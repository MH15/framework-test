#!/usr/bin/env node

import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";
import { makeDirs } from "./utils/file";
import { buildWatch } from "./builder";
import { LiveServer, WebSocketController } from './server/live-server';
const WebSocket = require("ws")

const commander = require('commander');
const program = new commander.Command();


let baseDir = process.cwd()


let component = `<template></template>

<style lang="sass">    
h1 {
    background: orange;
}
</style>

<script></script>
`
var copydir = require('copy-dir');


program.version('0.0.1')
    // .option('-v, --version', )
    .command('init')
    .description('Initiate a new project.')
    .action(() => {
        console.log("Creating all default files...")
        copydir.sync(join(__dirname, '..', 'default'), baseDir)
        console.log("   Done.")
        // TODO: make the rest of the default files
    })

program.command('create <type> <name>')
    .description('Create a new component or controller')
    .action((type: string, name) => {
        switch (type.toLowerCase()) {
            case 'component':
                let dirComponents = join(baseDir, 'components')
                mkdirSync(dirComponents, { recursive: true })
                writeFileSync(join(dirComponents, name + ".component"), component)
                break;
            case 'controller':
                throw new Error('Controller creation not yet implemented.')
            default:
                console.error("That's not a valid creation type.")
        }
    })
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


program.parse(process.argv)

