#!/usr/bin/env node

import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";

const commander = require('commander');
const program = new commander.Command();


let baseDir = process.cwd()


let component = `<template></template>

<style lang="sass"></style>

<script></script>
`


program.version('0.0.1')
    // .option('-v, --version', )
    .command('init')
    .description('Initiate a new project.')
    .action(() => {
        mkdirSync(dirComponents, { recursive: true })
    })
    .command('create <type> <name>')
    .description('Create a new component or controller')
    .action((type: string, name) => {
        switch (type.toLowerCase()) {
            case 'component':
                console.log(process.cwd())
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
    .command('develop <name>')
    .description('Develop a component using the live server.')
    .action((name) => {

    })


program.parse(process.argv)

