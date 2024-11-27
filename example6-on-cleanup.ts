import { createSignal, createEffect, createMemo, onCleanup } from './signals';

console.log("1. Create");
const [firstName, setFirstName] = createSignal("John");
const [lastName, setLastName] = createSignal("Smith");
const [showFullName, setShowFullName] = createSignal(true);

const displayName = createMemo(() => {
  console.log("### executing displayName");
  onCleanup(() =>
    console.log("### releasing displayName dependencies")
  );
  if (!showFullName()) return firstName();
  return `${firstName()} ${lastName()}`
});

createEffect(() => console.log("My name is", displayName()));

console.log("2. Set showFullName: false ");
setShowFullName(false);

console.log("3. Change lastName");
setLastName("Legend");

console.log("4. Set showFullName: true");
setShowFullName(true);

/**
 * 1. Create
 * ### executing displayName
 * My name is John Smith
 * 2. Set showFullName: false
 * ### releasing displayName dependencies
 * ### executing displayName
 * My name is John
 * 3. Change lastName
 * 4. Set showFullName: true
 * ### releasing displayName dependencies
 * ### executing displayName
 * My name is John Legend
 */