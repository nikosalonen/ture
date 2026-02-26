import {useEffect} from 'react';
import {ipcRenderer} from 'electron';

export const useShowWindow = (show: boolean) => {
  useEffect(() => {
    if (show) {
      ipcRenderer.invoke('kap-window-mount');
    }
  }, [show]);
};
