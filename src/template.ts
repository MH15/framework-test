/**
 * Template uses the DOM module to search and replace items in the DOM.
 * 
 */
import * as DOM from "./dom/node"
import { mutation } from "./dom/traversal"
import { Component } from "./component"
import { join, sep } from "path"
import { Parser } from "./utils/parser"
import * as assert from "assert"
import { type } from "os"

/**
pseudocode:

function combine(node) {
    gather included files
        find all included components
    mutate the node and its children
        whenever an included template appears in the root DOM,
            parse said template
                (this includes recursion)
            copy it into place in the root DOM

    1. do the DOM combine using mutation methdods
    2. do the style and script combine using string methods

}
*/

let ERROR = {
    KEY_NOT_FOUND: (key) => { return `Error: key "${key} not found.` }
}


export class TemplateParser extends Parser {
    sepLeft = "{{"
    sepRight = "}}"
    openBraces = 0
    newString = ""
    data: object


    constructor(content: string, separators?: Array<string>) {
        super(content)
        if (separators) {
            this.sepLeft = separators[0]
            this.sepRight = separators[1]
        }
    }

    load(content: string, data: object) {
        this.input = content
        this.index = 0
        this.line = 1
        this.col = 0

        this.data = data
    }


    advance(): string {
        while (this.hasNext()) {
            this.newString += this.consumeWhitespace()
            if (this.startsWith("{{")) {
                this.parseReplacement()
            } else {
                this.newString += this.consume()
            }
        }
        return this.newString
    }

    parseReplacement() {
        assert.equal(this.consume(), "{")
        assert.equal(this.consume(), "{")

        // whitespace inside tags is not retained
        this.consumeWhitespace()

        // get data, filter maybe?
        let key = this.parseKey()
        // TODO: find data
        let val = getProp(this.data, key)
        console.log("typeof val:", typeof val)
        if (typeof val !== undefined) {
            this.newString += val
        } else {
            throw ERROR.KEY_NOT_FOUND(key)
        }

        if (typeof val == undefined) {
            console.error(ERROR.KEY_NOT_FOUND(key))
            throw ERROR.KEY_NOT_FOUND(key)
        }

        this.consumeWhitespace()
        assert.equal(this.consume(), "}")
        assert.equal(this.consume(), "}")


    }

    parseKey(): string {
        /* Additional (optional) characters can be: a 
        letter, a digit, underscore, colon, period, 
        dash, or a “CombiningChar” or “Extender” character, 
        which I believe allows Unicode attributes names. */
        let regex = new RegExp(/[a-zA-Z0-9\-:_@.]/)
        return this.consumeWhile((char) => {
            return char.match(regex)
        })
    }


}

/** Get a nested property from an object without returning any errors.
 * If the property or property chain doesn't exist, undefined is returned.
 * Property names with spaces may use either dot or bracket "[]" notation.
 * Note that bracketed property names without surrounding quotes will fail the lookup.
 *      e.g. embedded variables are not supported.
 * @param {object} obj The object to check
 * @param {string} prop The property or property chain to get (e.g. obj.prop1.prop1a or obj['prop1'].prop2)
 * @returns {*|undefined} The value of the objects property or undefined if the property doesn't exist
 */
function getProp(obj: object, prop: string) {
    // Replace [] notation with dot notation
    prop = prop.replace(/\[["'`](.*)["'`]\]/g, ".$1")

    return prop.split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : undefined
    }, obj || self)
} // --- end of fn getProp() --- //