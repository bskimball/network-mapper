import { EventEmitter } from "node:events";

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();

export default emitter;
