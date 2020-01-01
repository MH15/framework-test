/**
 * Template uses the DOM module to search and replace items in the DOM.
 * 
 */
import { Parser } from "./utils/parser"
import * as assert from "assert"
import { type } from "os"



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
            console.log("peeks:", this.peek())
            console.log("p", 0)

            this.newString += this.consumeWhitespace()

            if (this.hasNext()) {
                console.log("p", 1)
                if (this.startsWith("{{")) {
                    console.log("p", 2)
                    console.log("starts with {{")
                    this.parseReplacement()
                } else {
                    console.log("p", 3)
                    let char = this.consume()
                    console.log("char:", char)
                    this.newString += char
                }
                console.log("p", 4)
            }

        }
        console.log("p", 5)
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
        console.log(`key: ${key}, value: ${val}`)

        if (val == undefined) {
            // TODO: better errror handling
            throw new Error(ERROR.KEY_NOT_FOUND(key))
        } else {
            this.newString += val
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