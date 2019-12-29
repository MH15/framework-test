"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic parser of strings
 */
class Parser {
    constructor(content) {
        this.input = content;
        this.index = 0;
        this.line = 1;
        this.col = 0;
    }
    error() {
        let errorString = this.input.substring(this.index - 15, this.index);
        errorString += "{" + this.input.charAt(this.index);
        errorString += "}" + this.input.substring(this.index + 1, this.index + 15);
        return `error on line ${this.line}: "${errorString}"`;
    }
    // Return the next character without advancing.
    peek() {
        return this.input.charAt(this.index);
    }
    // Return the next character and advance.
    consume() {
        if (this.hasNext()) {
            let res = this.peek();
            this.index++;
            if (res == "\n") {
                this.line++;
                this.col = 0;
            }
            else {
                this.col++;
            }
            return res;
        }
        else {
            console.error("too far");
        }
    }
    // Does the parser have more characters to consume?
    hasNext() {
        return this.index < this.input.length;
    }
    // Does the current input start with the given string?
    startsWith(s) {
        let result = true;
        if (this.index + s.length > this.input.length) {
            result = false;
        }
        else {
            let compare = this.input.slice(this.index, this.index + s.length);
            if (compare != s) {
                result = false;
            }
        }
        return result;
    }
    // Consume characters until test returns false.
    consumeWhile(test) {
        let result = "";
        while (this.hasNext() && test(this.peek())) {
            result += this.consume();
        }
        return result;
    }
    // Consume whitespace.
    consumeWhitespace() {
        return this.consumeWhile((char) => {
            return ' \t\n\r\v'.indexOf(char) >= 0;
        });
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map