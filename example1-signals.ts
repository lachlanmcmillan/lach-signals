import { createSignal } from "./signals";

const [count, setCount] = createSignal(0);

// read a value
console.log(count()); // 0

// set a value
setCount(5);
console.log(count()); //5
