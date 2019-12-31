#!/usr/bin/env node
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
const path_1 = require("path");
const fs_1 = require("fs");
const builder_1 = require("./builder");
const live_server_1 = require("./server/live-server");
const file_1 = require("./utils/file");
const current_parser_1 = require("./dom/current-parser");
const app_1 = require("./app");
const WebSocket = require("ws");
const commander = require('commander');
const program = new commander.Command();
let baseDir = process.cwd();
let component = `<template></template>

<style lang="scss">    
h1 {
    background: orange;
}
</style>

<script></script>
`;
var copydir = require('copy-dir');
const version = require('../package.json').version;
program.version(version)
    .option('-v, --version');
program.command('init')
    .description('Initialize a new project.')
    .action(() => {
    console.log("Creating all default files...");
    copydir.sync(path_1.join(__dirname, '..', 'default'), baseDir);
    console.log("   Done.");
    // TODO: make the rest of the default files
});
/**
 * Create a new component or controller.
 */
program.command('create <type> <name>')
    .description('Create a new component or controller')
    .action((type, name) => {
    console.log(`Creating a new ${type.toLowerCase()}.`);
    switch (type.toLowerCase()) {
        case 'component':
            let dirComponents = path_1.join(baseDir, 'components');
            console.log("DIRRR", dirComponents);
            file_1.newDir(dirComponents);
            fs_1.writeFileSync(path_1.join(dirComponents, name + ".component"), component);
            break;
        case 'controller':
            throw new Error('Controller creation not yet implemented.');
        default:
            console.error("That's not a valid creation type.");
    }
});
/**
 * Develop a component
 */
program.command('develop <name>')
    .description('Develop a component using the live server.')
    .action((name) => __awaiter(this, void 0, void 0, function* () {
    const DIR_OUT = path_1.join(baseDir, 'dist');
    const DIR_SEARCH = path_1.join(baseDir, 'components');
    const DIR_ROOT = path_1.join(baseDir, "components", `${name}.component`);
    const DEVELOP_ROOT = path_1.join(baseDir, "dist", "develop");
    // TODO: combine LiveServer and WebSocketController into one class that extends Server
    let liveServer = new live_server_1.LiveServer(DEVELOP_ROOT);
    yield liveServer.start(8081);
    console.log("starting liveserver");
    const wss = new WebSocket.Server({ port: 8089 });
    let connection;
    wss.on('connection', (ws) => {
        ws.on('message', message => {
            // console.log(`Received message => ${message}`)
        });
        ws.send('ho!');
        connection = ws;
        builder_1.buildWatch({}, DIR_OUT, DIR_SEARCH, DIR_ROOT, connection);
    });
}));
program.command('parse <name>')
    .description('Parse a component using the new parser')
    .action((name) => __awaiter(this, void 0, void 0, function* () {
    let framework = new app_1.Framework(baseDir);
    const DIR_INCLUDE = path_1.join(baseDir, 'components');
    let file = fs_1.readFileSync(path_1.join(DIR_INCLUDE, name + ".component"), "utf8");
    // console.log(file)
    let root = current_parser_1.parsing(file);
    let data = {
        test: "frank",
        ha: {
            alpha: "h.alphaaa"
        }
    };
    framework.watch(name, data);
}));
program.parse(process.argv);
//# sourceMappingURL=cli.js.map