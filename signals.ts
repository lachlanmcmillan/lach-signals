type Signal = [Get: () => any, Set: (value: any) => void ];

let currentEffect: any = null;

export const createSignal = (value: any): Signal => {
  let store = value;
  let subscribers: any[] = [];

  const getter = () => {
    if (currentEffect) {
      subscribers.push(currentEffect);
    }

    return store;
  }

  const setter = (v: any) => { 
    store = v;

    for (let sub of subscribers) {
      sub.run();
    }
  }

  return [
    getter,
    setter 
  ]
}

export const createEffect = (callback: () => void) => {
  currentEffect = {
    run: callback
  }

  callback();

  currentEffect = null;
}

export const createMemo = (callback: () => void) => {
  let cachedResult: any;
  let subscribers: any = []

  currentEffect = {
    run: () => {
      cachedResult = callback();

      for (let sub of subscribers) {
        sub.run();
      }
    }
  }

  currentEffect.run();

  currentEffect = null;

  const getter = () => {
    if (currentEffect) {
      subscribers.push(currentEffect);
    }

    return cachedResult;
  }

  return getter;
}