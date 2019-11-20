

import { readFileSync, writeFileSync } from "fs"

import { parse } from 'node-html-parser';

const DomParser = require('dom-parser')
const parser = new DomParser()

export function parseHTML(content: string): any {
    let a = parse(content)
    return a
}