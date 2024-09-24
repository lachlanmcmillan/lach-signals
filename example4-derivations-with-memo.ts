import { createSignal, createEffect, createMemo } from './signals';

/**
 * But sometimes the computational cost of our derived value is expensive and we
 * don't want to redo the work. For that reason, we have a 3rd basic primitive
 * that acts similar to function memoization to store intermediate computations
 * as their own signal. These are known as Derivations but are also called
 * Memos, Computeds, Pure Computeds.
 *
 * Compare what happens when we make fullName a Derivation.
 */

console.log("1. Create Signals");
const [firstName, setFirstName] = createSignal("John");
const [lastName, setLastName] = createSignal("Smith");

console.log("2. Create Derivation");
const fullName = createMemo(() => {
  console.log("Creating/Updating fullName");
  return `${firstName()} ${lastName()}`
});

console.log("3. Create Reactions");
createEffect(() => console.log("My name is", fullName()));
createEffect(() => console.log("Your name is not", fullName()));

console.log("4. Set new firstName");
setFirstName("Jacob");

/**
 * 1. Create Signals
 * 2. Create Derivation
 * Creating/Updating fullName
 * 3. Create Reactions
 * My name is John Smith
 * Your name is not John Smith
 * 4. Set new firstName
 * Creating/Updating fullName
 * My name is Jacob Smith
 * Your name is not Jacob Smith
 */
