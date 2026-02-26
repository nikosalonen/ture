import React, {createContext, useContext, useState, useEffect, useRef} from 'react';

const StateContext = createContext(new Map());

export class Container {
  constructor() {
    this._listeners = [];
  }

  setState(updater, callback) {
    return Promise.resolve().then(() => {
      let nextState;
      if (typeof updater === 'function') {
        nextState = updater(this.state);
      } else {
        nextState = updater;
      }

      if (nextState == null) {
        if (callback) {
          return callback();
        }

        return;
      }

      this.state = Object.assign({}, this.state, nextState);
      const promises = this._listeners.map(fn => fn());
      return Promise.all(promises).then(() => {
        if (callback) {
          return callback();
        }
      });
    });
  }

  subscribe(fn) {
    this._listeners.push(fn);
  }

  unsubscribe(fn) {
    this._listeners = this._listeners.filter(f => f !== fn);
  }
}

export function Provider({inject = [], children}) {
  const parentMap = useContext(StateContext);

  const map = new Map(parentMap);
  for (const instance of inject) {
    map.set(instance.constructor, instance);
  }

  return (
    <StateContext.Provider value={map}>
      {children}
    </StateContext.Provider>
  );
}

export function Subscribe({to, children}) {
  const map = useContext(StateContext);
  const [, forceUpdate] = useState(0);

  const instancesRef = useRef(
    to.map(ContainerClass => {
      if (map.has(ContainerClass)) {
        return map.get(ContainerClass);
      }

      return new ContainerClass();
    })
  );

  useEffect(() => {
    const listener = () => {
      forceUpdate(n => n + 1);
      return Promise.resolve();
    };

    for (const instance of instancesRef.current) {
      if (instance) {
        instance.subscribe(listener);
      }
    }

    return () => {
      for (const instance of instancesRef.current) {
        if (instance) {
          instance.unsubscribe(listener);
        }
      }
    };
  }, []);

  return children(...instancesRef.current);
}
