type Signal = [Get: () => any, Set: (value: any) => void];
type Effect = { run: (self?: Effect) => void, cleanupFns: Set<any> };

let currentEffect: Effect | null = null;

export const createSignal = (value: any): Signal => {
  let store = value;
  // aka. effects, autoruns, watches, or computeds
  let reactions: Set<Effect> = new Set();

  const getter = () => {
    // If the signal is called during an effect, add the effect as a subscriber.
    // The subscribers is a set, so adding the same effect multiple times won't
    // cause it to be called multiple times.
    if (currentEffect) {
      reactions.add(currentEffect);
      // capture the value of currentEffect in the closure
      const capturedEffect = currentEffect;
      currentEffect.cleanupFns.add(() => {
        reactions.delete(capturedEffect);
      });
    }

    return store;
  }

  const setter = (newValue: any) => { 
    store = newValue;

    // the reactions set is mutated while we're iterating over it
    // which can cause endless loops
    const reactionsSnapshot = new Set(reactions);
    // rerun all of the reactions that are subscribed to this signal
    for (let reaction of reactionsSnapshot) {
      currentEffect = reaction;
      reaction.run();
    }
  }

  return [
    getter,
    setter,
  ]
}

export const createEffect = (callback: () => void) => {
  currentEffect = { run: callback, cleanupFns: new Set() };
  currentEffect.run();
  currentEffect = null;
}

export const createMemo = (callback: () => void) => {
  let cachedResult: any;
  let reactions: Set<Effect> = new Set();
  let reactionCleanupFns = new Set<any>();

  const run = () => {
    // remove this memo from all of the signals that subscribed to it.
    // they will be re-added when calling callback() if they're still
    // relevant
    for (const cleanupFn of reactionCleanupFns) {
      cleanupFn();
    }
    reactionCleanupFns.clear()
    cachedResult = callback();

    // reactions may be mutated while we're iterating over them
    const reactionsSnapshot = new Set(reactions);
    reactions.clear()
    for (let reaction of reactionsSnapshot) {
      currentEffect = reaction;
      reaction.run();
    }

    currentEffect = null;
  }

  currentEffect = { run, cleanupFns: reactionCleanupFns };

  currentEffect.run();

  const getter = () => {
    if (currentEffect) {
      reactions.add(currentEffect);
    }

    return cachedResult;
  }

  return getter;
}