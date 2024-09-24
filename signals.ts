type Signal = [Get: () => any, Set: (value: any) => void];
type Effect = { run: (self?: Effect) => void, cleanupFns: Set<any> };

let currentEffect: Effect | null = null;
let loop = 0;

export const createSignal = (value: any, name: string): Signal => {
  let store = value;
  let storeName = name;
  // aka. effects, autoruns, watches, or computeds
  let reactions: Set<Effect> = new Set();

  const getter = () => {
    // If the signal is called during an effect, add the effect as a subscriber.
    // The subscribers is a set, so adding the same effect multiple times won't
    // cause it to be called multiple times.
    if (currentEffect) {
      reactions.add(currentEffect);
      // capture the current effect in the closure
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
      // currentEffect = reaction;
      reaction.run(reaction);
    }
  }

  return [
    getter,
    setter,
  ]
}

export const createEffect = (callback: () => void) => {
  const run = function runEffect(self?: Effect) {
    if (self) {
      currentEffect = self;
    }

    callback();
  }

  currentEffect = { run, cleanupFns: new Set() };

  currentEffect.run();

  currentEffect = null;
}

export const createMemo = (callback: () => void) => {
  let cachedResult: any;
  let reactions: Set<Effect> = new Set();
  let cleanupFns = new Set<any>();

  const run = function runMemo(self?: Effect) {
    const reactionsSnapshot = new Set(reactions);
    // first remove this memo from all of the reactions it was subscribed to
    if (self) {
      for (const cleanupFn of self.cleanupFns) {
        cleanupFn();
      }
      cleanupFns.clear()
      reactions.clear()
      currentEffect = self;
    }

    cachedResult = callback();

    for (let reaction of reactionsSnapshot) {
      reaction.run(reaction);
    }

    currentEffect = null;
  }

  currentEffect = { run, cleanupFns };

  currentEffect.run();

  const getter = () => {
    if (currentEffect) {
      reactions.add(currentEffect);
    }

    return cachedResult;
  }

  return getter;
}