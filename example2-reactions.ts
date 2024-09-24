import { createSignal, createEffect } from "./signals";

/**
 * At their heart Signals are event emitters. But the key difference is the way
 * subscriptions are managed.
 * 
 * # Reactions #
 * 
 * Signals alone are not very interesting without their partner in crime, 
 * Reactions. Reactions, also called Effects, Autoruns, Watches, or 
 * Computeds, observe our Signals and re-run them every time their value 
 * updates.
 * 
 * These are wrapped function expressions that run initially, and whenever 
 * our signals update.
 */

console.log("1. Create Signal");
const [count, setCount] = createSignal(0);

console.log("2. Create Reaction");
createEffect(() => console.log("The count is", count()));

console.log("3. Set count to 5");
setCount(5);

console.log("4. Set count to 10");
setCount(10);