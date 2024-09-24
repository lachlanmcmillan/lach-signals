import { createSignal, createEffect, createMemo } from './signals';

console.log("1. Create");
const [firstName, setFirstName] = createSignal("John");
const [lastName, setLastName] = createSignal("Smith");
const [showFullName, setShowFullName] = createSignal(true);

const displayName = createMemo(() => {
  if (!showFullName()) return firstName();
  return `${firstName()} ${lastName()}`
});

createEffect(() => { console.log("My name is", displayName())});

console.log("2. Set showFullName: false");
setShowFullName(false);

console.log("3. Change lastName");
setLastName("Legend");

console.log("4. Set showFullName: true");
setShowFullName(true);

/**
 * 1. Create
 * My name is John Smith
 * 2. Set showFullName: false
 * My name is John
 * 3. Change lastName
 * 4. Set showFullName: true
 * My name is John Legend
 */

/**
 * The thing to notice is that when we change the lastName in step 3, we do not
 * get a new log. This is because every time we re-rerun a reactive expression
 * we rebuild its dependencies. Simply, at the time we change the lastName no
 * one is listening to it.
 *
 * The value does change, as we observe when we set showFullName back to true.
 * However, nothing is notified. This is a safe interaction since in order for
 * lastName to become tracked again showFullName must change and that is
 * tracked.
 *
 * Dependencies are the signals that a reactive expression reads to generate its
 * value. In turn, these signals hold the subscription of many reactive
 * expressions. When they update they notify their subscribers who depend on
 * them.
 */