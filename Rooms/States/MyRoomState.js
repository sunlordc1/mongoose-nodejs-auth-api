import schema from '@colyseus/schema'
const Schema = schema.Schema;


export class MyState extends Schema {
    constructor () {
        super();

        this.width = 4
        this.height = 5
        this.items =6

    }
}
schema.defineTypes(MyState, {
    width: "number",
    height: "number",
    items: "number"
  });