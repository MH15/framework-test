#!/usr/bin/env node

import { join } from "path"
import { writeFileSync } from "fs"
import { newDir } from "./utils/file"
import { Framework } from "./app"

const commander = require('commander')
const program = new commander.Command()


let baseDir = process.cwd()


let component = `<template></template>

<style lang="scss">    
h1 {
    background: orange;
}
</style>

<script></script>
`
var copydir = require('copy-dir')

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
                break
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
        let framework = new Framework(baseDir)

        // TODO: get data from a file?
        let data = {
            test: "frank",
            ha: {
                alpha: "h.alphaaa"
            }
        }
        framework.watch(name, data)
    })

program.parse(process.argv)

