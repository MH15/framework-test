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
const file_1 = require("./utils/file");
const app_1 = require("./app");
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
    console.log("fuck");
    let framework = new app_1.Framework(baseDir);
    // TODO: get data from a file?
    let data = {
        test: "frank",
        ha: {
            alpha: "h.alphaaa"
        }
    };
    framework.watch(name, data);
}));
program.command('fuck')
    .action(() => __awaiter(this, void 0, void 0, function* () {
    console.log("WHAT THE H");
}));
program.parse(process.argv);
//# sourceMappingURL=cli.js.map