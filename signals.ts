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