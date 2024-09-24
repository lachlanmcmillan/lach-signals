import { createSignal, createEffect } from './signals';

console.log("1. Create Signals");
const [firstName, setFirstName] = createSignal("John");
const [lastName, setLastName] = createSignal("Smith");
const fullName = () => {
  console.log("Creating/Updating fullName");
  return `${firstName()} ${lastName()}`
};

console.log("2. Create Reactions");
createEffect(() => console.log("My name is", fullName()));
createEffect(() => console.log("Your name is not", fullName()));

console.log("3. Set new firstName");
setFirstName("Jacob");

/**
 * 1. Create Signals
 * 2. Create Reactions
 * Creating/Updating fullName
 * My name is John Smith
 * Creating/Updating fullName
 * Your name is not John Smith
 * 3. Set new firstName
 * Creating/Updating fullName
 * My name is Jacob Smith
 * Creating/Updating fullName
 * Your name is not Jacob Smith
 */