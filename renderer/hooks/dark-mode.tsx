import {useState, useEffect} from 'react';

const useDarkMode = () => {
  const remote = require('utils/electron-remote') as typeof import('@electron/remote') | undefined;
  const nativeTheme = remote?.nativeTheme;
  const [isDarkMode, setIsDarkMode] = useState(nativeTheme?.shouldUseDarkColors ?? false);

  useEffect(() => {
    if (!nativeTheme) {
      return;
    }

    const listener = () => {
      setIsDarkMode(nativeTheme.shouldUseDarkColors);
    };

    nativeTheme.on('updated', listener);
    return () => {
      nativeTheme.off('updated', listener);
    };
  }, []);

  return isDarkMode;
};

export default useDarkMode;
