class Startup {
    public static main(): number {
        console.log('Hello World');
        return 0;
    }
}

Startup.main();


interface Template {

}

import { Component } from './component';
import { join } from "path";





let component = new Component(join(__dirname, '..', 'components', 'demo.component'))
console.log(component)

component.build()


console.log(component)