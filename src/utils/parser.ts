/**
 * Generic parser of strings
 */
class Parser {
    input: string
    index: number
    constructor(content) {
        this.input = content
        this.index = 0
    }

    // Return the next character without advancing.
    peek(): string {
        return this.input.charAt(this.index)
    }

    // Return the next character and advance.
    consume(): string {
        if (this.hasNext()) {
            let res = this.peek()
            this.index++
            return res
        } else {
            console.error("too far")
        }
    }

    // Does the parser have more characters to consume?
    hasNext(): boolean {
        return this.index < this.input.length
    }

    // Does the current input start with the given string?
    startsWith(s: string): boolean {
        let result = true
        if (this.index + s.length > this.input.length) {
            result = false
        } else {
            let compare = this.input.slice(this.index, this.index + s.length)
            if (compare != s) {
                result = false
            }
        }
        return result
    }

    // Consume characters until test returns false.
    consumeWhile(test: Function): string {
        let result = ""
        while (this.hasNext() && test(this.peek())) {
            result += this.consume()
        }
        return result
    }

    // Consume whitespace.
    consumeWhitespace() {
        this.consumeWhile((char) => {
            return ' \t\n\r\v'.indexOf(char) >= 0
        })
    }

}

export { Parser }