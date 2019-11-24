#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const commander = require('commander');
const program = new commander.Command();
console.log("welcome");
let baseDir = process.cwd();
let component = `
<template></template>

<style lang="sass"></style>

<script><script>
`;
program.version('0.0.1')
    // .option('-v, --version', )
    .command('create <type> <name>')
    .description('Create a new component or controller')
    .action((type, name) => {
    switch (type.toLowerCase()) {
        case 'component':
            console.log(process.cwd());
            let dirComponents = path_1.join(baseDir, 'components');
            fs_1.mkdirSync(dirComponents, { recursive: true });
            fs_1.writeFileSync(path_1.join(dirComponents, name + ".component"), component);
            break;
        case 'controller':
            throw new Error('Controller creation not yet implemented.');
        default:
            console.error("That's not a valid creation type.");
    }
})
    .command('develop <name>')
    .description('Develop a component using the live server.')
    .action((name) => {
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map