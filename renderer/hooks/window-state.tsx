import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {ipcRenderer} from 'electron';

const WindowStateContext = createContext<any>(undefined);

export const WindowStateProvider = (props: {children: ReactNode}) => {
  const [windowState, setWindowState] = useState();

  useEffect(() => {
    ipcRenderer.invoke('kap-window-state').then(setWindowState);

    const listener = (_event: any, newState: any) => {
      setWindowState(newState);
    };

    ipcRenderer.on('kap-window-state', listener);

    return () => {
      ipcRenderer.removeListener('kap-window-state', listener);
    };
  }, []);

  return (
    <WindowStateContext.Provider value={windowState}>
      {props.children}
    </WindowStateContext.Provider>
  );
};

// Should not be used directly
// Each page should export its own typed hook
// eslint-disable-next-line @typescript-eslint/comma-dangle
const useWindowState = <T,>() => useContext<T>(WindowStateContext);

export default useWindowState;
