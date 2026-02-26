import {AppProps} from 'next/app';
import {useState, useEffect} from 'react';
import useDarkMode from '../hooks/dark-mode';
import GlobalStyles from '../utils/global-styles';
import ErrorBoundary from '../utils/error-boundary';
import {WindowStateProvider} from '../hooks/window-state';
import classNames from 'classnames';

const Kap = (props: AppProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <MainApp {...props}/>;
};

const MainApp = ({Component, pageProps}: AppProps) => {
  const isDarkMode = useDarkMode();
  const className = classNames('cover-window', {dark: isDarkMode});

  return (
    <div className={className}>
      <ErrorBoundary>
        <WindowStateProvider>
          <Component {...pageProps}/>
          <GlobalStyles/>
        </WindowStateProvider>
      </ErrorBoundary>
    </div>
  );
};

export default Kap;
