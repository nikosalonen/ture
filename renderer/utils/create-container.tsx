import React, {createContext, useContext} from 'react';

export interface Container<Value = any, State = void> {
  Provider: React.ComponentType<{initialState?: State; children: React.ReactNode}>;
  useContainer: () => Value;
}

export function createContainer<Value, State = void>(useHook: (initialState?: State) => Value): Container<Value, State> {
  const Context = createContext<Value | null>(null);

  function Provider({initialState, children}: {initialState?: State; children: React.ReactNode}) {
    const value = useHook(initialState);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContainer(): Value {
    const value = useContext(Context);
    if (value === null) {
      throw new Error('Component must be wrapped with <Container.Provider>');
    }

    return value;
  }

  return {Provider, useContainer};
}
