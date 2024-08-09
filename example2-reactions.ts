import { createSignal, createEffect } from "./signals";

console.log("1. Create Signal");
const [count, setCount] = createSignal(0);

console.log("2. Create Reaction");
createEffect(() => console.log("The count is", count()));

console.log("3. Set count to 5");
setCount(5);

console.log("4. Set count to 10");
setCount(10);